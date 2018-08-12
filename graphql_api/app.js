require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');

const { corsConfig, formatError } = require('./config');

const app = express();

// -- MIDDLEWARE -- //
app.use(cors(corsConfig));

// -- GRAPHQL -- //
const schema = require('./schema');
const { models, exampleUser } = require('./models');

const api = new ApolloServer({
  schema,
  context: {
    user: exampleUser,
    models,
  },
  formatError,
});

api.applyMiddleware({ app });

// -- MONGO -- //
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to database');
    const PORT = process.env.PORT || 8008;
    app.listen(PORT, () => console.log(`listening on ${PORT}`));        
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });