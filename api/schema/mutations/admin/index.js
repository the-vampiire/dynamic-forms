const { merge } = require('lodash');

const Form_Create = require('./form_create/form_create_mutation');
const Question_Create = require('./question_create/question_create_mutation');

module.exports = merge(
  Form_Create,
  Question_Create,
);
