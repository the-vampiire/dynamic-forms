module.exports = {
  Query: {
    Forms: async (
      _,
      { purpose, versions },
      { models: { DynamicForm } },
    ) => {
      const forms = versions ?
        // returns all matching versions
        await DynamicForm.find({ purpose, version: { $in: versions } }) :
        // returns all dynamic forms sorted by descending version
        await DynamicForm.find({ purpose }).sort({ version: -1 });

      return forms;
    },
  },
};
