const mongoose = require('mongoose');
const { isEmail, isURL } = require('validator');

const purposes = require('./purpose_enum');
/**
 * DEFAULTS:
 *  data_type: String
 *  minlength: 5
 *  maxlength: 500
 *  custom validator
 *    multiple responses - uses min / maxlength if passed
 *      min_choices : 1
 *    email: email validator
 *    url: url validator
 */

// -- IS / HAS -- //

const isArrayType = (input_type) => {
  switch (input_type) {
    case 'checkbox':
    case 'checkbox_2_column':
    case 'dropdown_multiple':
      return true;
    default:
      return false;
  }
}

const hasValidator = (input_type) => {
  // has 'min_choices' validator
  if (isArrayType(input_type)) return true;

  return [ 
    'url', // has url validator
    'email', // has email validator
  ].includes(input_type);
}

// -- MAPPERS -- //

const mapTypeConstructor = (data_type) => {
  const type_map = {
    Number: Number,
    String: String,

// DEV TODO currently unsupported
    // Date: Date,
    // Boolean: Boolean,
    // ObjectId: mongoose.Schema.Types.ObjectId,
  };
  return type_map[data_type];
};

const mapValidator = (input_type, minlength) => {
  const min = minlength || 1;

  const validators = {
    min_choices: {
      validator: val => { console.log(val); return val.length >= min},
      message: `At least ${min} choices are required`,
    },
    email: {
      validator: val => val.isEmail,
      message: 'Invalid email',
    },
    url: {
      validator: val => val.isURL,
      message: 'Invalid URL',
    },
  }

  return isArrayType(input_type) ?
    validators['min_choices'] :
    validators[input_type];
}

const mapSchema = (
  { 
    data_type,
    input_type,
    options,
    minlength,
    maxlength,
  },
) => {
  const field_schema = {};
  
  // sets 'type' of [{ type: Constructor }] or type: Constructor
  // based on multiple or single response capture
  field_schema.type = isArrayType(input_type) ?
    [{ type: mapTypeConstructor(data_type) }] : 
    mapTypeConstructor(data_type);

  // add text validation for min and max length
  // default min: 5, default max: 500
  if (['text', 'textarea'].includes(input_type)) {
    field_schema.minlength = minlength || 5;
    field_schema.maxlength = maxlength || 500;
  }
  
  // add custom validators as needed
  if (hasValidator(input_type)) {
    field_schema.validate = mapValidator(
      input_type,
      minlength,
    );
  }

  // set enum if preset 'options' are passed
  if (options) field_schema.enum = options;
  
  return field_schema;
};

// -- CONSTRAINTS -- //

// returns Mongoose Schema with unique constraints
  // sets single or composite unique constraints based on form purpose
const schemaWithConstraints = (raw_schema, purpose) => {
  let constraint_fields;
  switch (purpose) {
    default:
      constraint_fields = { user_id: 1 };
      break;
  }

  const constrained_schema = new mongoose.Schema(raw_schema);
  constrained_schema.index(constraint_fields, { unique: true });

  return constrained_schema;
};

// -- BASE SCHEMA -- //

// returns a base schema to reduce fields into
const getSchemaBase = (purpose) => {
  const base = {
    version: {
      type: Number,
      required: true,
    },
    purpose: {
      type: String,
      enum: purposes,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId, // change to 'Number' for SQL relationships
      required: true,
    },
  };

  // TODO: add additional fields below
    // for specific 'purpose' dynamic forms
  switch (purpose) {
    // case 'custom':
      // base.custom_field = custom_field_schema
      // return base
    default:
      return base;
  }
};

// -- MAIN EXPORT -- //

// returns a mapped and constrained Mongoose Schema
// uses Question data
const createSchema = (questions, purpose) => {
  // DEV-TODO handle min / max length validators for field and array

  // reduces questions into a raw schema building on top of base schema
  // formats and adds a schema field for each question
  const raw_schema = questions.reduce(
    (formSchema, question ) => {
      const updated_form_schema = { ...formSchema };

      // maps the field 'type' Constructors
        // they are stored as String to survive the
        // stringifyng conversion to BSON on Mongo storage
      updated_form_schema[question.field_name] = mapSchema(question);
      return updated_form_schema;
    },
    getSchemaBase(purpose), // base schema + custom 'purpose' based fields
  );

  // returns mongoose Schema with constraints added
  return schemaWithConstraints(raw_schema, purpose);
};

module.exports = createSchema;
