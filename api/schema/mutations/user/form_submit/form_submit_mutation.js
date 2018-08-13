module.exports = {
  Mutation: {
    Form_Submit: async (
      _,
      { purpose, version, form_data },
      { models: { DynamicForm }, user },
    ) => {
      const form = await DynamicForm.findOne({ purpose, version });
      const form_model = await form.dynamicModel();

      // save form data -> returns form responses document
      return form_model.create({
        user_id: user.id,
        version,
        purpose,
        ...form_data,
      });
    },
  },
};
