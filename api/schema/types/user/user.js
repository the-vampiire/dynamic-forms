module.exports = {
  User: {
    form_responses: async (
      root,
      { purpose },
      { models: { DynamicForm }, user },
    ) => {
      // get DynamicForm schema using purpose
      const dynamic_form = await DynamicForm.findOne({ purpose });
      if (!dynamic_form) throw new Error(`no dynamic form found for purpose: ${purpose}`);

      // create DynamicModel to query corresponding purpose-collection
      const form_model = await dynamic_form.dynamicModel();

      return form_model.find({ user_id: root.id });
    },
  },
};
