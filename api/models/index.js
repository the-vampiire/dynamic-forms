const DynamicForm = require('./dynamic_form');
const DynamicQuestion = require('./dynamic_question');
const User = require('./user');

const mockUser = {
  id: 1,
  username: 'the-vampiire',
}

module.exports = {
  models: {
    DynamicForm,
    DynamicQuestion,
    User,
  },
  mockUser,
};
