const { typeDefs, resolvers } = require('./Schemas');
const { ApolloServer } = require('@apollo/server');
const express = require('express');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve static files from the client build directory
app.use(express.static(path.join(__dirname, '../client/dist')));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    return authMiddleware({ req });
  },
});

async function startApolloServer() {
  await server.start();

  // Apply Apollo Server middleware to Express app
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });

    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
}

startApolloServer();
