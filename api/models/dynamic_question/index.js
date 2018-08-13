const mongoose = require('mongoose');

const dynamic_question_schema_shape = {
  field_name: {
    type: String,
    required: true,
    unique: true,
  }, // name of field in document build from dynamic form

  text: { // for responses and as 'label' in builder data
    type: String,
    required: true,
  },

  subtext: String,

  options: {
    type: [{ type: String }],
  },

  input_type: {
    type: String,
    enum: [ // TODO: update input types here and question_input_type_enum.graphql
      'checkbox',
      'checkbox_2_column',
      'date',
      'dropdown',
      'email',
      'hidden',
      'radio',
      'text',
      'textarea',
      'url',
    ],
  },

  schema_data: {
    // DEV TODO handle custom validators
      // validate min / max choices for array type?
    type: {},
    required: true,
  },

  tags: {
    type: [{ type: String }],
    enum: [ // TODO: update tags here and in question_tag_enum.graphql
      'ability',
      'accountability',
      'availability',
      'character',
      'challenge',
      'cohort',
      'commitment',
      'communication',
      'identifier',
      'personal',
      'teamwork',
      'user',
    ],
    index: true, // add index for searching
  },
};

// DEV TODO look into what this means?
/**
 * When your application starts up, Mongoose automatically calls createIndex for each defined index in your schema. 
 * Mongoose will call createIndex for each index sequentially, and emit an 'index' event on the model when all the 
 * createIndex calls succeeded or when there was an error. 
 * While nice for development, it is recommended this behavior be disabled in production 
 * since index creation can cause a significant performance impact.
 *  Disable the behavior by setting the autoIndex option of your schema to false, or globally on the connection 
 * by setting the option autoIndex to false.
 */

const dynamic_question_schema = new mongoose.Schema(dynamic_question_schema_shape);
const DynamicQuestion = mongoose.model('dynamic_question', dynamic_question_schema);

module.exports = DynamicQuestion;
