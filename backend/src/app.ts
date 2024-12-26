import { ApolloServer, gql } from "apollo-server-lambda";
import fs from "fs";
import path from "path";
import { resolvers } from "./resolvers";
require("dotenv").config();

// Load GraphQL schema
const typeDefs = gql`${fs.readFileSync(path.resolve(__dirname, "./schema/schema.graphql"), "utf8")}`;

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context,
  }),
});

// Export handlers for AWS Lambda
export const graphqlHandler = server.createHandler();
