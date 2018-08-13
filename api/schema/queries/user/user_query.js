module.exports = {
  Query: {
    User: async (
      _,
      { username, user_id },
      { models: { User }, user },
    ) => {
      if (user_id) return User.findById(user_id);
      if (username) return User.findOne({ username });
      return user; // return auth user if no args are passed
    },
  },
};
