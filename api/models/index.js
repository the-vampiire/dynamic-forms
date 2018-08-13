const DynamicForm = require('./dynamic_form');
const DynamicQuestion = require('./dynamic_question');

const exampleUser = {
  id: 1,
  username: 'the-vampiire',
  avatar: 'https://avatars3.githubusercontent.com/u/25523682?s=400&v=4',
}

module.exports = {
  models: {
    DynamicForm,
    DynamicQuestion,
  },
  exampleUser,
};
