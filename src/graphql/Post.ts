import {
  extendType,
  nonNull,
  objectType,
  stringArg,
  booleanArg,
  intArg,
  inputObjectType,
  enumType,
  arg,
  list,
} from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";
import { Prisma } from "@prisma/client";

export const Post = objectType({
  name: "Post",
  definition(t) {
    t.nonNull.string("title");
    t.nonNull.string("id");
    t.nonNull.string("content");
    t.nonNull.boolean("published");
    //@ts-ignore
    t.nonNull.dateTime("createdAt"); // I genuinely have no idea why this is resulting in an error but whatever
    t.field("postedBy", {
      type: "User",
      resolve(parent, args, context) {
        return context.prisma.post
          .findUnique({ where: { id: parent.id } })
          .postedBy();
      },
    });
  },
});

export const Feed = objectType({
  name: "Feed",
  definition(t) {
    t.nonNull.list.nonNull.field("posts", { type: Post });
    t.nonNull.int("count");
    t.id("id");
  },
});

export const PostQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feed", {
      type: "Feed",
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(PostOrderByInput)) }),
      },
      async resolve(parent, args, context) {
        const where = args.filter
          ? {
              OR: [
                { title: { contains: args.filter } },
                { content: { contains: args.filter } },
              ],
            }
          : {};
        const posts = await context.prisma.post.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.PostOrderByWithRelationInput>
            | undefined,
        });

        const count = await context.prisma.post.count({ where }); // 2
        const id = `main-feed:${JSON.stringify(args)}`; // 3

        return {
          // 4
          posts,
          count,
          id,
        };
      },
    });
  },
});

export const singlePost = extendType({
  type: "Query",
  definition(t) {
    t.field("singlePost", {
      type: "Post",
      args: {
        postID: nonNull(stringArg()),
      },
      async resolve(parent, args, context) {
        const { postID } = args;
        const post = await context.prisma.post.findFirst({
          where: { id: postID },
        });
        return post;
      },
    });
  },
});

export const PostOrderByInput = inputObjectType({
  name: "PostOrderByInput",
  definition(t) {
    t.field("title", { type: Sort });
    t.field("content", { type: Sort });
    t.field("createdAt", { type: Sort });
  },
});

export const Sort = enumType({
  name: "Sort",
  members: ["asc", "desc"],
});

export const PostMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("newPost", {
      type: "Post",
      args: {
        title: nonNull(stringArg()),
        content: nonNull(stringArg()),
        published: nonNull(booleanArg()),
      },
      resolve(parent, args, context) {
        const { title, content, published } = args;
        const { userId } = context;

        if (!userId) {
          throw new Error("Cannot post without logging in.");
        }

        const newPost = context.prisma.post.create({
          data: {
            title,
            content,
            published,
            postedBy: { connect: { id: userId } }, // 2
          },
        });

        return newPost;
      },
    });
  },
});
