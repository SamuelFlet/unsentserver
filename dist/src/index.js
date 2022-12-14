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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const apollo_server_core_1 = require("apollo-server-core");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const schema_1 = require("./schema");
const context_1 = require("./context");
function startApolloServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const httpServer = http_1.default.createServer(app);
        const server = new apollo_server_express_1.ApolloServer({
            schema: schema_1.schema,
            context: context_1.context,
            introspection: true,
            csrfPrevention: true,
            cache: "bounded",
            plugins: [
                (0, apollo_server_core_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
                (0, apollo_server_core_1.ApolloServerPluginLandingPageProductionDefault)({ embed: true, graphRef: 'My-Graph-3u7yzi@current' }),
            ],
        });
        yield server.start();
        server.applyMiddleware({ app });
        app.get("*", (req, res) => {
            res.send(`<a href=https://data.unsentletters.click/graphql>GO TO HERE</a>`);
        });
        yield new Promise((resolve) => httpServer.listen({ port: process.env.PORT || 8081 }, resolve));
    });
}
startApolloServer();
//# sourceMappingURL=index.js.map