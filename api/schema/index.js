const { makeExecutableSchema } = require('apollo-server');
const { importSchema } = require('graphql-import');
const { merge } = require('lodash');
const { join } = require('path');

const QueryResolvers = require('./queries');
const MutationResolvers = require('./mutations');
const TypeResolvers = require('./types');

const resolvers = merge(
  QueryResolvers,
  MutationResolvers,
  TypeResolvers,
);

const typeDefs = importSchema(
  join(__dirname, 'schema.graphql'),
);

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
});
