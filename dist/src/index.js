"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const apollo_server_lambda_1 = require("apollo-server-lambda");
const apollo_server_core_1 = require("apollo-server-core");
const schema_1 = require("./schema");
const context_1 = require("./context");
exports.server = new apollo_server_lambda_1.ApolloServer({
    schema: schema_1.schema,
    context: context_1.context,
    introspection: true,
    plugins: [(0, apollo_server_core_1.ApolloServerPluginLandingPageLocalDefault)()],
});
const port = process.env.PORT || 3000;
exports.handler = exports.server.createHandler();
