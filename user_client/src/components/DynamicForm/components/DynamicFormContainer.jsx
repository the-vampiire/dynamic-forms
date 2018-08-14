import React from "react";

import DynamicFormSubmit from "./DynamicFormSubmit";
import DynamicFormMaker from './DynamicFormMaker';

export default class DynamicFormContainer extends React.Component {
  constructor(props) {
    super(props);
    // TODO: handle disabled flag for disabling(rendering) the submit button
    // let questions control a disabled flag in on form change
    const { purpose, version, questions } = props;
    this.state = {
      purpose,
      version,
      questions,
      form_data: this.initializeFormData(purpose, questions),
    }

    this.onFormChange = this.onFormChange.bind(this);
  }

  initializeFormData = (purpose, questions) => {
    const persistedData = window.localStorage.getItem(purpose);
    if (persistedData) return JSON.parse(persistedData);

    // if no persisted data is found use default mapping method
    return this.mapFormDataFields(questions);
  }

  mapFormDataFields = (questions) => questions.reduce(
    (form_data, { field_name, input_type }) => {
      // creates a Set for multiple answers
      if (
        // add other multiple answer types here
        [
          'checkbox',
          'checkbox_2_column',
        ].includes(input_type)
      ) form_data[field_name] = [];
      else form_data[field_name] = '';

      // insert hidden field values from hiddenData
        // passed as hiddenData and / or queryString prop of <DynamicForm>
      if (input_type === 'hidden') {
        const { hiddenData } = this.props;
        if (!hiddenData || hiddenData[field_name]) {
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

  toggleValueInArray = (array, value) => {
    const clone = array.slice(0);
    const index = clone.indexOf(value);
    index !== -1 ? clone.splice(index, 1) : clone.push(value);

    return clone;
  }

  onFormChange = ({ currentTarget }) => {
    const { name, value, type } = currentTarget;
    const form_data = { ...this.state.form_data };

    form_data[name] = type === 'checkbox' ?
      form_data[name] = this.toggleValueInArray(form_data[name], value) :
      form_data[name] = value;

    // persistence in LS
    window.localStorage.setItem(
      this.state.purpose,
      JSON.stringify(form_data),
    );

    this.setState({ form_data });
  }

  onSubmit = (submitMutation, variables) => {
    // clear LS form persistence on submit
    window.localStorage.removeItem(this.state.purpose);
    submitMutation({ variables });
  }
  render() {
    const { purpose, version, questions, form_data } = this.state;
    return (
      <div>
        {DynamicFormMaker(questions, this.onFormChange, form_data)}
        <hr className="hline" />
        <DynamicFormSubmit
          onSubmit={this.onSubmit}
          submitRedirect={this.props.submitRedirect}
          variables={{ purpose, version, form_data }}
        />
      </div>
    );
  }
};