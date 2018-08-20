import React from "react";
import PropTypes from "prop-types";

import DynamicFormMaker from "./DynamicFormMaker";
import DynamicFormSubmit from "./DynamicFormSubmit"

class DynamicFormContainer extends React.Component {
  constructor(props) {
    super(props);
    // TODO: handle disabled flag for disabling(rendering) the submit button
    // let questions control a disabled flag in on form change
    const { purpose, version, questions } = props;
    this.state = {
      purpose,
      version,
      questions,
      form_data: this._initializeFormData(purpose, questions),
    }
  }

  /**
   * initializes the 'form_data' field of state
   * 
   * - uses local storage persisted data if available
   * - otherwise maps over 'questions' using _mapFormDataFields()
   */
  _initializeFormData = (purpose, questions) => {
    const persistedData = window.localStorage.getItem(purpose);
    if (persistedData) return JSON.parse(persistedData);

    // if no persisted data is found use default mapping method
    return this._mapFormDataFields(questions);
  }

  _isMultiAnswer = (input_type) => {
    // add other multiple answer types here
    return [
      'checkbox',
      'checkbox_2_column',
    ].includes(input_type)
  }

  /**
   * maps 'questions' to provide 'form_data' field defaults
   * 
   * - handles single and multi-answer defaults
   * - injects 'hiddenData' values
   */
  _mapFormDataFields = (questions) => questions.reduce(
    (form_data, { field_name, input_type }) => {
      // creates a Set for multiple answers
      if (this._isMultiAnswer(input_type)) form_data[field_name] = [];
      else form_data[field_name] = '';

      // insert hidden field values from hiddenData
        // passed as hiddenData and / or queryString prop of <DynamicForm>
      if (input_type === 'hidden') {
        const { hiddenData } = this.props;
        if (!hiddenData || !hiddenData[field_name]) {
          console.error(`Missing hiddenData for: ${field_name}`);
          return form_data;
        }

        const hiddenValue = hiddenData[field_name];
        form_data[field_name] = hiddenValue;
      }
      return form_data;
    },
    {},
  );

  /**
   * toggles values in multi-answer arrays
   */
  _toggleValueInArray = (array, value) => {
    const clone = array.slice(0);
    const index = clone.indexOf(value);
    index !== -1 ? clone.splice(index, 1) : clone.push(value);

    return clone;
  }

  /**
   * updates 'form_data' in state
   * 
   * - toggles or sets response value for 'question'
   * - stores current 'form_data' in local storage for persistence
   */
  _onFormChange = ({ currentTarget }) => {
    const { name, value, type } = currentTarget;
    const form_data = { ...this.state.form_data };

    form_data[name] = type === 'checkbox'
      ? this._toggleValueInArray(form_data[name], value)
      : form_data[name] = value;

    // persistence in LS
    window.localStorage.setItem(
      this.state.purpose,
      JSON.stringify(form_data),
    );
    
    this.setState({ form_data });
  }

  /**
   * Trigger for calling the submitMutation() function
   * 
   * - clears local storage
   * 
   * - passes 'variables' from state into submitMutation()
   *  - variables: { purpose, version, form_data }
   */
  handleSubmit = (submitMutation) => {
    // clear LS form persistence on submit
    window.localStorage.removeItem(this.state.purpose);
    const { questions, ...variables } = this.state;
    submitMutation({ variables });
  }


  /**
   * optional method for custom handling of data - loading - error
   * 
   * - provides mutationState object
   *  - data: response data from mutation
   *  - loading: boolean state of loading (during req-res)
   *  - error: error.message contains GraphQL error
   * - called during each step of the mutation process
   * - initiated by handleSubmit()
   */
  handleMutate = ({ data, loading, error }) => {}

  /**
   * calls DynamicFormMaker()
   * 
   * - creates form Question components for each 'question'
   */
  renderInputs = () => DynamicFormMaker(
    this.state.questions,
    this._onFormChange,
    this.state.form_data,
  );

  /**
   * renders the SubmitComponent
   * 
   * - injects handleSubmit()
   * - injects handleMutate()
   */
  renderSubmit = () => this.props.submitComponent({
    handleSubmit: this.handleSubmit,
    handleMutate: this.handleMutate,
  });

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.renderInputs()}
        {this.renderSubmit()}
      </form>
    );
  }
};

DynamicFormContainer.propTypes = {
  purpose: PropTypes.string,
  version: PropTypes.number,
  questions: PropTypes.array,
  hiddenData: PropTypes.object,
  submitComponent: PropTypes.element,
};

DynamicFormContainer.defaultProps = {
  handleMutate: null,
};

export default DynamicFormContainer;
