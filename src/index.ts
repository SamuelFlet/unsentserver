import { ApolloServer } from "apollo-server-azure-functions";
import { schema } from "./schema";
import { context } from "./context";

const server = new ApolloServer({
  schema,
  context,
  introspection: true,
});

exports.graphqlHandler = server.createHandler();
