import { ApolloServer } from "apollo-server-azure-functions";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { schema } from "./schema";
import { context } from "./context";

const server = new ApolloServer({
  schema,
  context,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
});

exports.graphqlHandler = server.createHandler();
