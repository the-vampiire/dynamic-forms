const { merge } = require('lodash');

const JSONScalar = require('./json/json');
const IntOrStringScalar = require('./int_or_string/int_or_string');

module.exports = merge(
  JSONScalar,
  IntOrStringScalar,
);
