const { merge } = require('lodash');

const AdminMutations = require('./admin');
const UserMutations = require('./user');

module.exports = merge(
  AdminMutations,
  UserMutations,
);
