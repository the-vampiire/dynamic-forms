import React from "react";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";

import Loading from "../../../Loading";
import Error from "../../../Error";
import QuestionComponents from "../../../DynamicForm/components/DynamicFormMaker/QuestionComponents/";

const introspectEnum = (
  enumName,
  queryName,
  rename,
) => {
  const queryDef = `
    query ${queryName} {
      ${rename}: __type(name: ${enumName}) {
          name
          options: enumValues {
            name
          }
      }
    }
  `;
  return gql(queryDef);
}

const InputTypeSelect = (
  { data, onFormChange, form_data },
) => (
  <div>
    <label>form input type</label>
    {QuestionComponents['dropdown'](data, onFormChange, form_data)}
  </div>
);

const InputTypeWrapper = (props) => (
  <Query query={
    introspectEnum(
      'QuestionInputTypeEnum',
      'GetInputTypes',
      'input_types',
    ) 
  } >
  {
    ({ data, loading, error }) => {
      if (loading) return <Loading />;
      if (error) return <Error error={error.message} />;

      const { input_types } = data;
      const question = {
        field_name: 'input_type',
        options: input_types.map(({ name }) => name),
      }

      return (
        <InputTypeSelect
          question={question}
          field_name={field_name}
          onFormChange={onFormChange}
        />
      );
    }
  }
  </Query>
);

export default InputTypeWrapper;
