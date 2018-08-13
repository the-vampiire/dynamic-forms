const typeConverter = (input_type, schema_type) => {
  switch (input_type) {
    // add other multi-answer input_type as cases here
    case 'checkbox':
    case 'checkbox_2_column':
    case 'dropdown_multiple':
      return [{ type: schema_type }];
    default:
      return schema_type;
  }
};

// TODO: how to determine the schema 'type' from input_type / options?
module.exports = {
  Mutation: {
    Question_Create: async (
      root,
      {
        input: {
          field_name,
          input_type,
          schema_data: schema,
          options,
          ...remaining_data
        },
      },
      { models: { DynamicQuestion } },
    ) => {
      const schema_data = { ...schema };
      // enforce snake_case for the field_name field (used as field in form schema)
      if (field_name.indexOf(' ') >= 0) throw new Error("Question 'field_name' field must be snake_case and cannot contain spaces");

      // default field to 'required' unles explicitly made optional
        // 'undefined' test because 'false' is a valid option
      if (schema.required === undefined) schema_data.required = true;

      // set schema enum to options array if available
      if (options) schema_data.enum = options;
      else { // min and max only apply for non enum fields (how to handle multi-answers / arrays?)
        // add min and max length defaults if none are passed explicitly
        if (!schema_data.minlength) schema_data.minlength = 10;
        if (!schema_data.maxlength) schema_data.maxlength = 500;
      }

      // for multiple answer questions set the schema 'type' to be array of that type
        // typeConverter will handle conversion as needed
      schema_data.type = typeConverter(input_type, schema_data.type);

      return DynamicQuestion.create({
        field_name,
        input_type,
        schema_data,
        options: options || null,
        ...remaining_data,
      });
    },
  },
};
