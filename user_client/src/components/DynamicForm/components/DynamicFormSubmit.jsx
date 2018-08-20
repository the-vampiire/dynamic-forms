import React from "react";
import PropTypes from "prop-types";
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
    Form_Submit(
      purpose: $purpose,
      version: $version,
      form_data: $form_data
    ) {
      id
    }
  }
`;

const DynamicFormSubmit = (
  {
    mutation,
    handleSubmit,
    handleMutate,
  },
) => (
  // custom mutation or default to 
  <Mutation mutation={mutation || submitDynamicFormMutation}>
    {
      (submitMutation, mutationStatus) => {
        if (handleMutate) {
          handleMutate(mutationStatus); // let parent control data - loading - error
        } else {
          // if handleMutate is not passed delegate mutation status handling to
          // DynamicFormSubmit
          const { data, loading, error } = mutationStatus;
          if (loading) return <Loading />;
          if (error) return <Error error={error.message} />;
          if (data) return <Redirect to="/" />;
        }
      
        return (
          <input
            className="form-btn"
            type="submit"
            value="submit"
            onClick={
              (e) => {
                e.preventDefault();
                handleSubmit(submitMutation);
              }
            }
          />
        );
      }
    }
  </Mutation>
);

DynamicFormSubmit.propTypes = {
  handleSubmit: PropTypes.func,
  handleMutate: PropTypes.func,
  mutation: PropTypes.string,
}

export default DynamicFormSubmit;
