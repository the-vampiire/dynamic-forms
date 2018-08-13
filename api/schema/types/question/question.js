module.exports = {
  Question: {
    minlength: ({ schema_data: { minlength } }) => minlength,
    maxlength: ({ schema_data: { maxlength } }) => maxlength,
  },
};
