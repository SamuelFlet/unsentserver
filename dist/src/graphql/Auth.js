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
exports.AuthMutation = exports.AuthPayload = void 0;
const nexus_1 = require("nexus");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth_1 = require("../utils/auth");
exports.AuthPayload = (0, nexus_1.objectType)({
    name: "AuthPayload",
    definition(t) {
        t.nonNull.string("token");
        t.nonNull.field("user", {
            type: "User",
        });
    },
});
exports.AuthMutation = (0, nexus_1.extendType)({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("login", {
            type: "AuthPayload",
            args: {
                email: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                password: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            resolve(parent, args, context) {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = yield context.prisma.user.findUnique({
                        where: { email: args.email },
                    });
                    if (!user) {
                        throw new Error("No such user found");
                    }
                    const valid = yield bcrypt.compare(args.password, user.password);
                    if (!valid) {
                        throw new Error("Invalid password");
                    }
                    const token = jwt.sign({ userId: user.id }, auth_1.APP_SECRET);
                    return {
                        token,
                        user,
                    };
                });
            },
        });
        t.nonNull.field("signup", {
            type: "AuthPayload",
            args: {
                email: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                password: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                name: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            resolve(parent, args, context) {
                return __awaiter(this, void 0, void 0, function* () {
                    const { email, name } = args;
                    const password = yield bcrypt.hash(args.password, 10);
                    const user = yield context.prisma.user.create({
                        data: { email, name, password },
                    });
                    const token = jwt.sign({ userId: user.id }, auth_1.APP_SECRET);
                    return {
                        token,
                        user,
                    };
                });
            },
        });
    },
});
//# sourceMappingURL=Auth.js.map