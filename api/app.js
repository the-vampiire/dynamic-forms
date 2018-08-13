require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');

const { corsConfig } = require('./config');
const { formatError, getAuthedUser } = require('./utilities');

const app = express();

// -- MIDDLEWARE -- //
app.use(cors(corsConfig));

// -- GRAPHQL -- //
const schema = require('./schema');
const models = require('./models');

const api = new ApolloServer({
  schema,
  context: async (
    { req: { headers: { authorization } } },
  ) => ({
    user: await getAuthedUser(authorization),
    models,
  }),
  formatError,
});

api.applyMiddleware({ app });

// -- MONGO -- //
mongoose.connect(
  process.env.MONGO_URI,
  (err) => console.log(err || 'Connected to database'),
);


const PORT = process.env.PORT || 8008;
app.listen(PORT, () => console.log(`listening on ${PORT}`));