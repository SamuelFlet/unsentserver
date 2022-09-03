import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";
import express from "express";

import http from "http";
import { schema } from "./schema";
import { context } from "./context";

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    schema,
    context,
    introspection: true,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageProductionDefault({ embed: true, graphRef: 'My-Graph-3u7yzi@current' }),
    ],
  });
  await server.start();

  server.applyMiddleware({ app });

  app.get("*", (req, res) => {
    res.send(`<a href=https://data.unsentletters.click/graphql>GO TO HERE</a>`);
  });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: process.env.PORT || 8081 }, resolve)
  );
}

startApolloServer();
