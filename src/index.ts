import { ApolloServer } from "apollo-server-azure-functions";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import express from "express";
import { schema } from "./schema";
import { context } from "./context";
import http from "http";

const server = new ApolloServer({
  schema,
  context,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
});

exports.graphqlHandler = server.createHandler();
