const { User } = require('./models');

const formatError = (error) => {
  if (process.env.NODE_ENV === 'development') console.error(error);
  return error;
};

// for appearances only
const getAuthedUser = (authorization) => {
  const id = "5b711d3cb8bb41e238300b41";
  return User.findById(id);
}

module.exports = {
  formatError,
  getAuthedUser,
};
