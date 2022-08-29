"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_azure_functions_1 = require("apollo-server-azure-functions");
const apollo_server_core_1 = require("apollo-server-core");
const schema_1 = require("./schema");
const context_1 = require("./context");
const server = new apollo_server_azure_functions_1.ApolloServer({
    schema: schema_1.schema,
    context: context_1.context,
    introspection: true,
    plugins: [(0, apollo_server_core_1.ApolloServerPluginLandingPageLocalDefault)()],
});
exports.graphqlHandler = server.createHandler();
