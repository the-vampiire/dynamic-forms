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
- create the form from a pool of Questions
  - add new Questions to the pool in seconds without writing a line of code
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
## Creation Steps
- 8/15/18: 3 days into the build
  - all Question and Form creation steps are done through GraphiQL / Playground
  - work in progress Dynamic Form Builder GUI [(mockup)](https://i.imgur.com/PaRJpNj.jpg) on the way!

### 1: add Questions to your Question Pool
#### Required
- field name
  - question identifier (snake_case)
- text
  - question text (user facing)
- input type [Enum]
  - for dynamic generation in React 
  - checkbox, select, radio, textarea, text, url, email, hidden
  - more to come!

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

### 2: Create a Form
#### Required
- purpose [Enum]
  - select a purpose from your `purposes` enum
  - identifier for a form
  - version defaults to 0 or auto increment on new forms for existing purpose
- questions
  - array of Question oID from Questions collection

### Optional
- notes
  - Admin notes describing a new form or version
  - for keeping track of form goals / outcomes and historical context

## Usage

### Client-Side
#### uses the DynamicForm component
- must pass `purpose` prop
- `version` prop is optional
  - if no version is passed the most recent version is used by default
- if a hidden field value is missing a console error is written listing the field for easier debugging

- can be called directly (contains minimal styling)
  - hidden field data passed through `queryString` prop as needed

- can be called from a wrapper component (**preferred**)
  - for adding a custom title
  - for additional styling
  - for injecting hidden field data from the wrapper component
    - can pass hidden field data from `hiddenData` and / or `queryString` props 




