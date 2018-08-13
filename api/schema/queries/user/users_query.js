module.exports = {
  Query: {
    Users: async (_, args, { models: { User } }) => User.find({}),
  },
};
