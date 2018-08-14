const { isString, isInteger } = require('lodash');
const { GraphQLScalarType, Kind } = require('graphql');

// https://stackoverflow.com/questions/49897319/graphql-union-scalar-type
const coerceIntOrString = (val) => {
  if (isString(val)) return String(val);
  if (isInteger(val)) return val;
  throw new Error('IntOrString must be an Integer or String');
}

module.exports = {
  IntOrString: new GraphQLScalarType({
    name: 'IntOrString',
    serialize: coerceIntOrString,
    parseValue: coerceIntOrString,
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return coerceIntOrString(parseInt(ast.value, 10))
      }
      if (ast.kind === Kind.STRING) {
        return ast.value
      }
      return undefined
    }
  }),
}
