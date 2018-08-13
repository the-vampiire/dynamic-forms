module.exports = {
  FormResponse: {
    responses: (
      { _doc: document }, // extract just the document (remove metadata)
      args,
      { models: { DynamicQuestion } },
    ) => { // document is the returned document from a form (purpose) collection
      // clean document to only have question fields
      const cleaned_fields = Object.keys(document)
        .filter(key => (
          key !== '_id' &&
          key !== '__v' &&
          key !== 'purpose' &&
          key !== 'user_id' &&
          key !== 'version'
        ));

      return Promise.all(
        cleaned_fields.map(async (field_name) => {
          // get associated question
          const question = await DynamicQuestion.findOne({ field_name });
          // always return an array
          const response_value = document[field_name];
          // array if already an array. value in array if not
            // FormResponse returns an array for both single and multi-answer responses
          const answer = Array.isArray(response_value) ? response_value : [response_value];
          // return the shape defined by UserFormResponse Type
          return { answer, question };
        }),
      );
    },
  },
};
