import { extendType, nonNull, objectType, stringArg, booleanArg } from "nexus";
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

export const PostQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {
      type: "Post",
      resolve(parent, args, context) {
        return context.prisma.post.findMany();
      },
    });
  },
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
