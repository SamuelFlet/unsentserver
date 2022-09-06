"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostMutation = exports.Sort = exports.PostOrderByInput = exports.SignOut = exports.RandomPost = exports.SinglePost = exports.PostQuery = exports.Feed = exports.Post = void 0;
const nexus_1 = require("nexus");
exports.Post = (0, nexus_1.objectType)({
    name: "Post",
    definition(t) {
        t.nonNull.string("title");
        t.nonNull.string("id");
        t.nonNull.string("content");
        t.nonNull.boolean("published");
        t.nonNull.string("img");
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
exports.Feed = (0, nexus_1.objectType)({
    name: "Feed",
    definition(t) {
        t.nonNull.list.nonNull.field("posts", { type: exports.Post });
        t.nonNull.int("count");
        t.id("id");
    },
});
exports.PostQuery = (0, nexus_1.extendType)({
    type: "Query",
    definition(t) {
        t.nonNull.field("feed", {
            type: "Feed",
            args: {
                filter: (0, nexus_1.stringArg)(),
                skip: (0, nexus_1.intArg)(),
                take: (0, nexus_1.intArg)(),
                orderBy: (0, nexus_1.arg)({ type: (0, nexus_1.list)((0, nexus_1.nonNull)(exports.PostOrderByInput)) }),
            },
            resolve(parent, args, context) {
                return __awaiter(this, void 0, void 0, function* () {
                    const where = args.filter
                        ? {
                            OR: [
                                { title: { contains: args.filter } },
                                { content: { contains: args.filter } },
                            ],
                        }
                        : {};
                    const posts = yield context.prisma.post.findMany({
                        where,
                        skip: args === null || args === void 0 ? void 0 : args.skip,
                        take: args === null || args === void 0 ? void 0 : args.take,
                        orderBy: args === null || args === void 0 ? void 0 : args.orderBy,
                    });
                    const count = yield context.prisma.post.count({ where }); // 2
                    const id = `main-feed:${JSON.stringify(args)}`; // 3
                    return {
                        // 4
                        posts,
                        count,
                        id,
                    };
                });
            },
        });
    },
});
exports.SinglePost = (0, nexus_1.extendType)({
    type: "Query",
    definition(t) {
        t.nonNull.field("singlePost", {
            type: "Post",
            args: {
                postID: (0, nexus_1.stringArg)(),
            },
            resolve(parent, args, context) {
                return __awaiter(this, void 0, void 0, function* () {
                    const where = args.postID
                        ? {
                            OR: [{ id: { contains: args.postID } }],
                        }
                        : {};
                    const post = yield context.prisma.post.findFirstOrThrow({
                        where,
                    });
                    return post;
                });
            },
        });
    },
});
exports.RandomPost = (0, nexus_1.extendType)({
    type: "Query",
    definition(t) {
        t.nonNull.field("randomPost", {
            type: "Post",
            resolve(parent, args, context) {
                return __awaiter(this, void 0, void 0, function* () {
                    const productsCount = yield context.prisma.post.count();
                    const skip = Math.floor(Math.random() * productsCount);
                    const post = yield context.prisma.post.findFirst({
                        skip: skip,
                        orderBy: {
                            createdAt: "desc",
                        },
                    });
                    return post;
                });
            },
        });
    },
});
exports.SignOut = (0, nexus_1.extendType)({
    type: "Query",
    definition(t) {
        t.field("signout", {
            type: "Boolean",
            resolve: () => {
                return true;
            },
        });
    },
});
exports.PostOrderByInput = (0, nexus_1.inputObjectType)({
    name: "PostOrderByInput",
    definition(t) {
        t.field("title", { type: exports.Sort });
        t.field("content", { type: exports.Sort });
        t.field("createdAt", { type: exports.Sort });
    },
});
exports.Sort = (0, nexus_1.enumType)({
    name: "Sort",
    members: ["asc", "desc"],
});
exports.PostMutation = (0, nexus_1.extendType)({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("newPost", {
            type: "Post",
            args: {
                img: (0, nexus_1.stringArg)(),
                title: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                content: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                published: (0, nexus_1.nonNull)((0, nexus_1.booleanArg)()),
            },
            resolve(parent, args, context) {
                const { img, title, content, published } = args;
                const { userId } = context;
                if (!userId) {
                    throw new Error("Cannot post without logging in.");
                }
                const newPost = context.prisma.post.create({
                    data: {
                        img,
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
//# sourceMappingURL=Post.js.map