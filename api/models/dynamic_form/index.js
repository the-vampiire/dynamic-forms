const mongoose = require('mongoose');
const Question = require('./dynamic_question');

const {
  createSchema,
  mapFieldType,
  getSchemaBase,
  schemaWithConstraints,
} = require('./utilities');

const purposes = require('./purpose_enum');


// -- DYNAMIC FORM SCHEMA -- //

const dynamic_form_schema_shape = {
  version: {
    type: Number,
    required: true,
    default: 0,
  },
  purpose: {
    type: String,
    enum: purposes,
  },
  notes: String,
  questions: {
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    required: true,
  },
};

const dynamic_form_schema = new mongoose.Schema(dynamic_form_schema_shape);

// -- INSTANCE METHODS -- //

/**
 * Populates Questions when requested in resolver
 */
dynamic_form_schema
.methods.getQuestions = async function getQuestions() {
  return Promise.all(
    // maps over the questions array (array of reference oIDs) to fetch question data
    this.questions.map(question_id => Question.findOne(question_id)),
  );
};

/**
 * Converts a dynamic form into a Mongoose Schema
 */
dynamic_form_schema
  .methods.dynamicSchema = async function dynamicSchema() {
    const questions = await this.getQuestions();
    return createSchema(questions, this.purpose); // returns a mongoose Schema
  };

/**
 * Converts a dynamic form into a Mongoose model
 * this model can then be used for creating, updating, and querying
 * the corresponding collection
 *  collection names are based on 'purpose' enum in purpose_enum.js
 *
 * the purpose collection can then be filtered by version
 */
dynamic_form_schema
  .methods.dynamicModel = async function dynamicModel() {
    const schema = await this.dynamicSchema();

    // prevents 'OverwriteModelError' error. I WILL HAVE MY DYNAMIC MODELS DAMMIT
      // https://stackoverflow.com/a/38143030/7542831
      // this error arises because mongoose registers models on creation / server startup
    try {
      // the try-block is for creating a non-existant model / collection (first time)
      return mongoose.model(this.purpose, schema);
    } catch (error) {
      // the catch-block is for returning an existing model / collection
      return mongoose.model(this.purpose);
    }
  };

// versions are auto-incremented when the 'purpose' dynamic form already exists
dynamic_form_schema.index({ purpose: 1, version: 1 }, { unique: true });

// -- MODEL -- //
const dynamicForm = mongoose.model('dynamic_form', dynamic_form_schema);

module.exports = dynamicForm;
