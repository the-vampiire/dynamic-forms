const { isString, isInteger } = require('lodash');

const matchesDataType = (
  option,
  data_type,
) => (
  data_type === 'Number' ?
    isInteger(option) :
    isString(option)
);

module.exports = {
  Mutation: {
    Question_Create: async (
      root,
      { input: { options, data_type, ...remaining_data } },
      { models: { DynamicQuestion } },
    ) => {
      if (
        !options.every(option => matchesDataType(option, data_type))
      ) {
        throw new Error('Options do not match data_type');
      }
      return DynamicQuestion.create({
        options,
        data_type,
        ...remaining_data,
      });
    },
  },
};
