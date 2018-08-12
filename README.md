# Dynamic Forms
### stack
- Apollo Server
- Apollo Client
- React-Apollo
- React
- React Router DOM
- Mongoose

# Client-Side
<hr>

## Anatomy of Components
### DynamicForm
```js
const DynamicForm = (
  {
    purpose,
    version,
    hiddenData,
    queryString,
    submitRedirect,
  },
) => {
  const dynamicFormQuery = gql`
    query getDynamicForm(
      $purpose:FormPurposeEnum!
      $version:Int){
      form(
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
  
  return (
    <Query query={dynamicFormQuery} variables={{ purpose, version }}>
      {
        ({ data, loading, error }) => {
          if (loading) return <Loader />;
          if (error) return <Error error={error.message} />;

          const { form: { purpose, version, questions } } = data;
          return (
            <DynamicFormContainer
              purpose={purpose}
              version={version}
              questions={questions}
              submitRedirect={submitRedirect}
              hiddenData={queryString ? qs.parse(queryString) : hiddenData}
            />
          );
        }
      }
    </Query>
  );
}
```
### purpose
- uses the generic dynamic form query
- retrieves the corresponding dynamic form (by purpose and optionally version)
- passes dynamic form data into DynamicFormContainer for rendering
### props
- purpose: form purpose 
- (optional) version: form version
- (optional) hiddenData: data for hidden fields (non-user submitted data)
- (optional) queryString: additional data from query string params
  - merges hiddenData and queryString into one object for using both avenues of hidden data injection
- (optional) submitRedirect: a path to redirect to after the form submission. defaults to `/profile`

### DynamicFormContainer
```js
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
      form_data: this.mapFormDataFields(questions), // snake_case for API
    }

    this.onFormChange = this.onFormChange.bind(this);
  }

  mapFormDataFields = (questions) => questions.reduce(
    (form_data, { field_name, input_type }) => {
      // creates a Set for multiple answers
      if (
        // add other multiple answer types here
        [
          'checkbox',
          'checkbox_2_column',
          'dropdown_multiple',
        ].includes(input_type)
      ) form_data[field_name] = new Set();
      else form_data[field_name] = '';

      // insert hidden field values from hiddenData
        // passed as hiddenData or queryString prop into <DynamicForm>
      if (input_type === 'hidden') {
        const hiddenValue = this.props.hiddenData[field_name];
        if (!hiddenValue) console.error(`Missing hiddenData: ${field_name}`);
        form_data[field_name] = hiddenValue;
      }
      return form_data;
    },
    {},
  );

...
...

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
```
### purpose
- receives dynamic form data
- manages dynamic form state
- renders DynamicFormMaker and DynamicFormSubmit
### props
- purpose: form purpose
- version: form version
- questions: Question objects with data for rendering, validating, and storing form fields
- submitRedirect: custom redirect path on submit
- hiddenData: data for 'hidden' input type fields (merging of queryString and hiddenData)

### DynamicFormSubmit
```js
const DynamicFormSubmit = ({ onSubmit, submitRedirect, variables }) => {
  const submitDynamicFormMutation = gql`
    mutation submitForm(
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

  return (
    <Mutation mutation={submitDynamicFormMutation}>
      {
        (submitMutation, { loading, error, data }) => {
          if (loading) return <Loader />;
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
}
```
### purpose
- uses the generic dynamic form submission mutation
- submits data and redirects
### props
- onSubmit: submission function controlled by DynamicFormContainer
- submitRedirect: custom redirect location on submission. default to `/profile`
- variables: form data to be submitted

### DynamicFormMaker
- refactored @serpient form making component
- maps over Question objects
- converts to Question components (by `input_type` arg)

### QuestionComponents
- refactored @serpient  form input type components
- uses new dynamic form data shape

## Using Dynamic Forms
- must pass `purpose` prop
  - this is an enum with current (8/12) values:
    - voyage_application
    - chingu_application
    - new_voyage_user
- `version` prop is optional
  - if no version is passed the most recent version is used by default
- if a hidden field value is missing an console error is written listing the field for easier debugging

### can be called directly (contains minimal styling)
  - hidden field data passed through `queryString` prop

### can be called from a wrapper class (preferred)
  - for adding a custom title
  - for additional styling
  - for adding hidden field data from the wrapper
    - can pass hidden field data from `hiddenData` and / or `queryString` props

## Example: Register Component
- injects `timezone` hidden field data
- adds additional styling
- adds a custom title


### view from the Route component
```js
<Route
  exact path="/register"
   render={
     () => <Register version={null} /> // set custom 'chingu_application' version here
   }
/>
```

### Register Component (wraps DynamicForm)
```js
const Register = ({ version }) => {
  // get users local timezone
  const timezone = new Date().getTimezoneOffset();
  return (
    <div className="chingu-application-container">
      <div className="chingu-application-modal">
        <div className="chingu-application-title">New User Onboarding Survey</div>
        <DynamicForm
          purpose="chingu_application"
          version={version}
          hiddenData={ { timezone } }
        />
      </div>
    </div>
  );
}
``` 
