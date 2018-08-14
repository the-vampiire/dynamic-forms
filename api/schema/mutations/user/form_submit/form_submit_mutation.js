const stripDuplicates = (form_data) => Object.keys(form_data)
  .reduce(
    (stripped_data, key) => {
      if (Array.isArray(form_data[key])) {
        // convert to Set to strip duplicates
        const temp_set = new Set(form_data[key]);
        // convert back to Array for storage
        stripped_data[key] = Array.from(temp_set);
      } else {
        stripped_data[key] = form_data[key];
      }
      return stripped_data;
    },
    {},
  );

module.exports = {
  Mutation: {
    Form_Submit: async (
      _,
      { purpose, version, form_data },
      { models: { DynamicForm }, user },
    ) => {
      const cleaned_data = stripDuplicates(form_data);
      const form = await DynamicForm.findOne({ purpose, version });
      const form_model = await form.dynamicModel();

      // save form data -> returns form responses document
      return form_model.create({
        user_id: user.id,
        version,
        purpose,
        ...cleaned_data,
      });
    },
  },
};
