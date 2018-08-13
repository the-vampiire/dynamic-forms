import React from "react";
import { Redirect } from "react-router-dom";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";

import Loading from "../../Loading";
import Error from "../../Error";

const submitDynamicFormMutation = gql`
  mutation DynamicFormSubmit(
    $purpose: FormPurposeEnum!
    $version: Int
    $form_data: JSON!
  ) {
    formSubmit(
      purpose: $purpose,
      version: $version,
      form_data: $form_data
    ) {
      id
    }
  }
`;

export default (
  { onSubmit, submitRedirect, variables },
) => (
  <Mutation mutation={submitDynamicFormMutation}>
    {
      (submitMutation, { loading, error, data }) => {
        if (loading) return <Loading />;
        if (error) return <Error error={error.message} />;
        if (data) return <Redirect to={submitRedirect || "/profile"} />
        return (
          <button
            className="form-btn"
            type="submit"
            value="submit"
            onClick={(e) => {
              e.preventDefault();
              onSubmit(submitMutation, variables);
            }}
          >
            Submit
          </button>
        );
      }
    }
  </Mutation>
);
