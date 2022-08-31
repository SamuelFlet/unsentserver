import { ApolloServer } from "apollo-server-express";

import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
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
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });
  await server.start();

  server.applyMiddleware({ app });
  app.get("*", (req, res) => {
  
    // Here user can also design an
    // error page and render it 
    res.send(`<a href=http://helloexpress-env.eba-ip82vmkx.us-east-1.elasticbeanstalk.com/graphql>GO TO HERE</a>`);
  });
    
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: process.env.PORT || 8081 }, resolve)
  );
}

startApolloServer();
