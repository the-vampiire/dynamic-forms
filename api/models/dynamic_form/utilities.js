const mongoose = require('mongoose');

const purposes = require('./purpose_enum');

const mapFieldType = (schema) => {
  const typeMap = {
    Number: Number,
    String: String,
    Date: Date,
    Boolean: Boolean,
    ObjectId: mongoose.Schema.Types.ObjectId,
  };

  const mappedSchema = { ...schema };

  // checks for 'type' top level or nested in an array
    // type: [{ type: Constructor }] <- nested in array
    // type: Constructor <- top level
  const schemaType = Array.isArray(schema.type) ? schema.type[0].type : schema.type;

  // assigns constructors from String: Constructor map (typeMap)
    // needed because constructor functions do not persist when docs are converted to JSON/BSON
    // a similar method can be used with a validatorMap for adding field validators
  if (Array.isArray(schema.type)) { // map array -> type: [{ type: Constructor }]
    mappedSchema.type[0].type = typeMap[schemaType];
  } else { // map top level -> type: Constructor
    mappedSchema.type = typeMap[schemaType];
  }

  return mappedSchema;
};

const schemaWithConstraints = (raw_schema, purpose) => {
  // sets single or composite unique constraints based on form purpose
  // TODO: set custom composite constraints here
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

const getSchemaBase = (purpose) => {
  const base = {
    version: {
      type: 'Number',
      required: true,
    },
    purpose: {
      type: 'String',
      enum: purposes,
    },
    user_id: {
      type: 'ObjectId', // change to 'Number' for SQL relationships
      required: true,
    },
  };

  // TODO: add additional fields below
    // for specific 'purpose' dynamic forms
  switch (purpose) {
    default:
      return base;
  }
};

const createSchema = (questions, purpose) => {
  // DEV-TODO handle min / max length validators for field and array

  // reduces questions into a raw schema building on top of base schema
  // formats and adds a schema field for each question
  const raw_schema = questions.reduce(
    (formSchema, { field_name, schema_data }) => {
      const updated_form_schema = { ...formSchema };

      // maps the field 'type' Constructors
        // they are stored as String to survive the
        // stringifyng conversion to BSON on Mongo storage
      updated_form_schema[field_name] = mapFieldType(schema_data);
      return updated_form_schema;
    },
    getSchemaBase(purpose), // base schema + custom 'purpose' based fields
  );

  // returns mongoose Schema with constraints added
  return schemaWithConstraints(raw_schema, purpose);
};

module.exports = createSchema;
