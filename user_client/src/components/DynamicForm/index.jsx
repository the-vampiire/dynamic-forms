import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import qs from "query-string";

import './DynamicForm.css';
import Loading from '../Loading';
import Error from '../Error';
import { client } from "../../";
import { DynamicFormWrapper } from "./components";

const dynamicFormQuery = gql`
  query DynamicForm(
    $purpose:FormPurposeEnum!
    $version:Int){
    dynamicFormData: Form(
      purpose:$purpose
      version: $version
    ) {
      id
      purpose
      version
      questions {
        id
        field_name
        text
        subtext
        input_type
        options
        minlength
        maxlength
      }
    }
  }
`;

const submitDynamicFormMutation = gql`
  mutation DynamicFormSubmit(
    $purpose: FormPurposeEnum!
    $version: Int
    $form_data: JSON!
  ) {
    Form_Submit(
      purpose: $purpose,
      version: $version,
      form_data: $form_data
    ) {
      id
    }
  }
`;

/**
 * @prop {string} purpose Dynamic Form purpose
 * @prop {number} version optional Dynamic Form version for given purpose
 * @prop {object} hiddenData optional object of values for hidden inputs
 * @prop {string} queryString optional query string data for hidden inputs
 */
const DynamicForm = (
  {
    purpose,
    version,
    hiddenData,
    queryString,
  },
) => (
  <Query query={dynamicFormQuery} variables={{ purpose, version }}>
    {
      ({ data, loading, error }) => {
        if (loading) return <Loading />;
        if (error) return <Error error={error.message} />;
        if (data.dynamicFormData) {
          const { dynamicFormData } = data;
          return (
            <DynamicFormWrapper
              client={client}
              mutation={submitDynamicFormMutation}
              hiddenData={
                queryString || hiddenData ?
                  Object.assign(hiddenData, qs.parse(queryString)) :
                  null
              }
              {...dynamicFormData}
            />
          );
        }
        return (
          <Error
            error={`No Dynamic Form found: purpose: ${purpose}, version: ${version}`}
          />
        )
      }
    }
  </Query>
);

DynamicForm.propTypes = {
  purpose: PropTypes.string,
  version: PropTypes.number,
  hiddenData: PropTypes.object,
  queryString: PropTypes.string,
}

export default DynamicForm;
