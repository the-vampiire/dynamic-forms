import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";

import './DynamicForm.css';
import Loader from '../Loader';
import Error from '../Error';
import { client } from "../../";
import dynamicFormQuery from "./dynamicFormQuery";
import {
  DynamicFormWrapper,
  DynamicFormContainer,
  dynamicFormMaker,
  questionComponents,
} from "./components";

const parseParams = (queryString) => {
  const queryParams = new URLSearchParams(queryString);
  const params = {};
  for(let entry of queryParams.entries()) {
    if(entry.length) {
      if(params[entry[0]]) {
        if(Array.isArray(params[entry[0]])) {
          params[entry[0]].push(...entry.slice(1));
        } else {
          params[entry[0]] = [params[entry[0]], ...entry.slice(1)];
        }
      } else {
        params[entry[0]] = entry.slice(1).length === 1 ? entry[1] : entry.slice(1);
      }
    }
  }
  return params;
}

/**
 * @prop {string} purpose Dynamic Form purpose (collection name)
 * --- OPTIONAL ---
 * @prop {number} version Dynamic Form version (defaults to latest)
 * @prop {object} hiddenData object of values for hidden inputs
 * @prop {string} queryString query string data for hidden inputs
 * @prop {func} onValidate custom handler for validating a form field (onChange)
 * @prop {func} onSubmit custom handler for submitting a form
 * @prop {func} onResponse custom handler for mutation response data
 * @prop {func} onError custom handler for mutation error data
 */
const DynamicForm = (
  {
    purpose,
    version,
    hiddenData,
    queryString,
    onValidate,
    onSubmit,
    onResponse,
    onError,
  },
) => (
  <Query query={dynamicFormQuery} variables={{ purpose, version }}>
    {
      ({ data, loading, error }) => {
        if (loading) return <Loader />;
        if (error) return <Error error={error.message} />;
        if (data.dynamicFormData) {
          const { dynamicFormData } = data;
          return (
            <DynamicFormWrapper
              client={client}
              hiddenData={
                queryString || hiddenData ?
                  Object.assign(hiddenData, parseParams(queryString)) :
                  null
              }
              onValidate={onValidate}
              onSubmit={onSubmit}
              onResponse={onResponse}
              onError={onError}
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
  onValidate: PropTypes.func,
  onSubmit: PropTypes.func,
  onResponse: PropTypes.func,
  onError: PropTypes.func,
}

DynamicForm.defaultProps = {
  onValidate: null,
  onSubmit: null,
  onResponse: null,
  onError: null,
}

export {
  DynamicForm,
  DynamicFormWrapper,
  DynamicFormContainer,
  dynamicFormMaker,
  questionComponents,
};
