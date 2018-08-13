module.exports = {
  Mutation: {
    Form_Create: async (
      _,
      { input },
      { models: { DynamicForm } },
    ) => {
      try {
        const new_form = await DynamicForm.create(input);
        return new_form;
      } catch (error) {
        // get highest version for particular purpose
        const previous_version = await DynamicForm
          .find({ purpose: input.purpose }) // filter by purpose
          .sort({ version: -1 }) // sort descending by version number
          .limit(1); // get highest

        const version_increment_input = { ...input }; // prevent param prop assignment
        const next_version = previous_version[0].version + 1; // increment version
        version_increment_input.version = next_version; // assign new version
        const new_version_form = await DynamicForm.create(version_increment_input);

        return new_version_form;
      }
    },
  },
};
