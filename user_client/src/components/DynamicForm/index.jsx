import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import qs from "query-string";

import './DynamicForm.css';
import Loading from '../Loading';
import Error from '../Error';
import DynamicFormContainer from "./components";
import DynamicFormSubmit from "./components/DynamicFormSubmit";

const dynamicFormQuery = gql`
  query DynamicForm(
    $purpose:FormPurposeEnum!
    $version:Int){
    Form(
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

const DynamicForm = (
  {
    purpose,
    version,
    hiddenData,
    queryString,
    submitComponent,
  },
) => (
  <Query query={dynamicFormQuery} variables={{ purpose, version }}>
    {
      ({ data, loading, error }) => {
        if (loading) return <Loading />;
        if (error) return <Error error={error.message} />;
        if (data.Form) {
          const { Form: { purpose, version, questions } } = data;
          return (
            <DynamicFormContainer
              purpose={purpose}
              version={version}
              questions={questions}
              hiddenData={
                queryString || hiddenData ?
                  Object.assign(hiddenData, qs.parse(queryString)) :
                  null
              }
              submitComponent={submitComponent}
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
  submitComponent: PropTypes.func,
};

DynamicForm.defaultProps = {
  submitComponent: DynamicFormSubmit,
}

export default DynamicForm;
