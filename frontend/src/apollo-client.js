// src/apollo-client.js
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: `${process.env.REACT_APP_GRAPHQL_URL}`, // Replace with your GraphQL API URL
  }),
  cache: new InMemoryCache(),
});

export default client;