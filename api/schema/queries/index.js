const { merge } = require('lodash');

const Form = require('./form/form_query');
const Forms = require('./form/forms_query');
const Questions = require('./questions/questions_query');
const User = require('./user/user_query');
const Users = require('./user/users_query');

module.exports = merge(
  Form,
  Forms,
  Questions,
  User,
  Users,
);
