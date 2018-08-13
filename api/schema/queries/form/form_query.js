module.exports = {
  Query: {
    Form: async (
      _,
      { purpose, version },
      { models: { DynamicForm } },
    ) => {
      if (version) {
        // if a version is passed use it to find specific purpose / version form
        return DynamicForm.findOne({ purpose, version });
      }
      // default to the latest version for that purpose form
      const latest_version = await DynamicForm
        .find({ purpose })
        .sort({ version: -1 })
        .limit(1);

      return latest_version[0];
    },
  },
};
