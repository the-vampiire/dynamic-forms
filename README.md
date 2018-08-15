# Dynamic Forms
### Main Technologies
- Apollo Server
- Apollo Client
- React-Apollo
- Mongoose

<hr>

## User Client
- [User Client Documentation](https://github.com/the-vampiire/dynamic-forms/blob/master/user_client/README.md)
### Contributors:
- [@serpient](https://github.com/serpient)
  - using a fork of her form input, Loading, and Error components
  - using her awesome styling!
<hr>

## Admin Client
- [Admin Client Documentation](UPDATE)

## GraphQL API
- [API Documentation](https://github.com/the-vampiire/dynamic-forms/blob/master/api/README.md)
<hr>

# [Dynamic Forms](https://github.com/the-vampiire/dynamic-forms)
Traditionally form creation involves the following 3 steps **for each new form or version**:
- designing a schema to provide data integrity and shape
- designing API access for submitting and querying form data
- designing the view layer for rendering the form to a user

With Dynamic Forms here are your new steps **for all forms and versions**:
- define a new or existing form `purpose`
  - this is the name of your form and db collection
  - automatic versioning for existing `purpose`
- create the form from a pool of questions
  - add new questions to the pool in seconds without writing a line of code
- call the DynamicForm component passing a `purpose` prop
  - optionally a `version` prop (for A/B..Z testing)
  - defaults to latest version

Yes. That's all. The schema, API, and form view are all generated dynamically.

# Problem and Solution
## Traditional Pain Points
- new forms require the 3-step dance to be repeated for each new format
- versioning requires maintaining of schemas, API access, and front end views to support changes to the form
- **the database schema, API, and view are tightly coupled**

## Dynamic Forms Solution
- simple code-less form creation
- automatic versioning without storing schema, API, and view layer code
- maintain the benefits of a database schema without manual creation
- a flexible GraphQL API that supports mutating and querying form data for any form
- a React view that can render forms and their inputs dynamically
- automatic client, API, and database validation for forms and submission
- **single dynamic source maintains database schema, API, and front end view**

<hr>

# How it Works
### 1: add Questions to your Question Pool
#### Required
- field name
  - question identifier (snake_case)
- text
  - question text (user facing)
- input type [Enum]
  - for dynamic generation in React 
  - checkbox, select, radio, textarea, text, url, email, more to come

#### Optional
- data_type: [Enum] (Int or String currently supported)
  - default: string
- subtext
  - additional information about the question (displayed below 'text')
- options
  - values for select, checkbox, radio
  - enum validation
- min length
  - minimum characters for text / textarea
  - minimum choices for multiple answer questions
- max length
  - max characters for text / textarea
- tags [[Enum]]
  - customizable tags you can apply for filtering / querying for Questions

- can be done manually through GraphiQL / Playground
- can use (WIP) Dynamic Form Builder GUI [mockup](https://i.imgur.com/PaRJpNj.jpg)

produces a Question Type
```js
type Question {
  id: ID!
  field_name: String!
  input_type: QuestionInputTypeEnum!
  text: String!
  subtext: String 
  data_type: QuestionDataTypeEnum
  options: [IntOrString!]
  minlength: Int
  maxlength: Int
  tags: [QuestionTagEnum!]
}
```

### 2: Create a Form




