# Types

## Form
#### the `purpose` of the form organizes the Dynamic Form versions and User form response data
- used as the name of the form response data collection
- `purpose` values are customizable by updating the enums in:
  - `./schema/enums/form_purpose_enum.graphql`
  - `./models/dynamic_form/purpose_enum.js`
    - **make sure to update both files when customizing**
```js
type Form {
  id: ID!
  purpose: FormPurposeEnum!
  version: Int!
  notes: String
  questions: [Question!]!
}
```

## Question
#### tags are used for filtering Question searches
- `tags` are customizable by updating the enums in:
  - `./schema/enums/question_tag_enum.graphql`
  - `./models/dynamic_question/tags_enum.js`
    - **make sure to update both files when customizing**
```js
type Question {
  id: ID!
  field_name: String!
  input_type: QuestionInputTypeEnum!
  text: String!
  subtext: String 
  data_type: QuestionDataTypeEnum!
  options: [IntOrString!]
  minlength: Int
  maxlength: Int
  tags: [QuestionTagEnum!]
}
```

<hr>

# Queries

## Form
### returns the corresponding Dynamic Form for Client rendering
#### Required
- purpose
#### Optional
- version
  - specific `version` to render
  - default: latest (highest number) `version`
```js
query GetForm(
  $purpose: FormPurposeEnum!
  version: Int
) {
  Form(
    purpose $purpose
    version: $version
  ) {
    ... requested fields ...
  }
}
```
### returns array of Dynamic Forms for given purpose / versions
- used for reviewing existing `purpose` versions
  - to see `notes` and / or create a new `version`
#### Required
- purpose
#### Optional
- versions: array of version numbers
  - specific `versions` to review
  - default: latest (highest number) `version`
```js
query GetForms(
  $purpose: FormPurposeEnum!
  versions: [Int!]
) {
  Forms(
    purpose $purpose
    versions: $versions
  ) {
    ... requested fields ...
  }
}
```
## Question
### returns the Questions Pool
- optional filters (additive):
  - input_type: [Enum]
    - returns Questions of the given `input_type`
  - tags: [Enum] array of tag options
    - returns Questions who have one or more of the listed `tags`
  - exact_match: Boolean
    - returns only Questions that match the entire set of `tags`
```js
query GetQuestions(
  $input_type: QuestionInputTypeEnum
  $tags: [QuestionTagEnum!]
  $exact_match: Boolean
) {
  Questions(
    input_type: $input_type
    tags: $tags
    exact_match: $exact_match
  ) {
    ...requested fields...
  }
}
```

## User form responses
### returns an array of a single User's responses to the given form `purpose`
```js
query GetUserResponses(
  $purpose: FormPurposeEnum!
) {
  User {
    ... other User fields ...

    form_responses(purpose: $purpose) {
      ... FormResponse fields ...
    }
  }
}
```

## Users form responses
### returns an array of a single User's responses to the given form `purpose`
```js
query GetUsersResponses(
  $purpose: FormPurposeEnum!
) {
  Users {
    ... other User fields ...
    
    form_responses(purpose: $purpose) {
      ... FormResponse fields ...
    }
  }
}
```
<hr>

# Mutations

## Form

## Question
### creating a Question -> returns Question Type
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
```js
mutation CreateQuestion(
  $input: QuestionCreateInput!
){
  Question_Create(input: $input) {
    ... requested fields ...
  }
}
```

