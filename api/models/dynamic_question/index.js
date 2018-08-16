const mongoose = require('mongoose');

const input_types = require('./input_types_enum');
const tags = require('./tags_enum');

const dynamic_question_schema_shape = {
  field_name: {
    type: String,
    required: true,
    unique: true,
  }, // name of field in document build from dynamic form

  text: { // 'question' text used as 'label' in input component
    type: String,
    required: true,
  },

  subtext: String,

  options: {
    type: [{ type: String }],
  },

  data_type: {
    type: String,
    enum: [
      'String',
      'Number',
      'Date',
      'Boolean',
      'ObjectId',
    ],
    default: 'String',
  },

  minlength: Number,

  maxlength: Number,

  input_type: {
    type: String,
    enum: input_types,
  },

  tags: {
    type: [{ type: String }],
    enum: tags,
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
