const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const db = require('./config/connection');
const { typeDefs, resolvers } = require('./graphql/schema'); // Import your GraphQL schema definitions and resolvers
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Apollo Server setup
const server = new ApolloServer({
  typeDefs, // Your GraphQL schema definitions
  resolvers, // Your GraphQL resolvers
  context: ({ req }) => ({ req }), // Optional context function to pass additional data to resolvers, in this case, you pass the Express request object
});

// Apply Apollo Server middleware to Express
server.applyMiddleware({ app });

// If we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Mount existing Express routes
app.use(routes);

// Start the server
db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
