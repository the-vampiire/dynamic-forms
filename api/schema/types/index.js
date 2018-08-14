const { merge } = require('lodash');

const FormResolvers = require('./form/form');
const FormResponseResolvers = require('./form_response/form_response');
const UserResolvers = require('./user/user');

module.exports = merge(
  FormResolvers,
  FormResponseResolvers,
  UserResolvers,  
);
