import React from "react";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import qs from "query-string";

import './DynamicForm.css';
import Loading from '../Loading';
import Error from '../Error';
import DynamicFormContainer from "./components";

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

export default (
  {
    purpose,
    version,
    hiddenData,
    queryString,
    submitRedirect,
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
              submitRedirect={submitRedirect}
              hiddenData={
                queryString || hiddenData ?
                  Object.assign(hiddenData, qs.parse(queryString)) :
                  null
              }
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
