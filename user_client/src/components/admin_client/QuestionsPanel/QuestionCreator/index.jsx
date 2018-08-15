/**
  * multiple selection buttons
  * - tags
  * - data_type
  * 
  * use grid to wrap / grow vertically to support
  * https://stackoverflow.com/questions/43129360/css-grid-wrapping
  */

/**
 * -----------------
 * QuestionCreator |
 * -----------------
 * 
 * Mutation - Question_Create
 *  input: {
 *    +field_name: STRING
 *    +input_type: [] 
 *    +text: STRING
 *    +data_type: [String, Number]
 *    subtext: STRING
 *    options: LIST
 *    minlength: INT
 *    maxlength: INT
 *    tags: []
 *  }
 * 
 * UI - replaces QuestionsPool
 * ---------------------------
 * - re-render QuestionsPool on submit
 * - store id on each mutation response in QuestionsPanel
 *   - put new question at top of QuestionsPool by id
 *     - sort by date in resolver response?
 *   - option to show all created Questions (from current session)?
 * 
 * Inputs
 * ---------------------------
 * 
 * Text
 * ----
 *  - field_name [form field name]
 *    - enforces / converts to snake_case
 *    - stores as lowercase
 *  - text [question text]
 *  - subtext [question subtext]
 *  - maxlength [multiple answer ? null : 'maximum character length']
 *    - stores as Number
 *  - minlength [multiple answer ? 'minimum number of choices' : 'minimum character length']
 *    - stores as Number
 *  - option (part of 'options' input)
 *    - enforces / converts to match data_type
 * 
 * Dropdown
 * --------
 *  - input_type [form input type]
 * 
 * MultiButton Options
 * -------------------
 *  - tags [for Question filtering]
 *    - Query: introspection on QuestionTagEnum
 *  - data_type [storage data type]
 *    - display Number as Integer for clarity? (uses Number constructor in schema)
 * 
 * 
 * ---------------------------
 * 
 * Structure
 * ---------
 */
