const { makeExecutableSchema } = require('apollo-server');
const { importSchema } = require('graphql-import');
const { merge } = require('lodash');
const { join } = require('path');

const Query = require('./queries');
const Mutation = require('./mutations');

const resolvers = merge(Query, Mutation);
const typeDefs = importSchema(
  join(__dirname, 'schema.graphql'),
);

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
});
