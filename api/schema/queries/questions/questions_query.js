module.exports = {
  Query: {
    Questions: async (
      root,
      { input_type, tags, exact_match },
      { models: { DynamicQuestion } },
    ) => {
      const query = {};
      // incrementally build up the query object
      if (input_type) query.input_type = input_type;
      // search for any tag within the tags array input or for exact match of whole array
      if (tags) query.tags = exact_match ? tags : { $all: tags };

      return DynamicQuestion.find(query);
    },
  },
};
