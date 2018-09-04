import { gql } from "apollo-boost";

const dynamicFormSubmitMutation = gql`
  mutation dynamicFormSubmit(
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

export default dynamicFormSubmitMutation;
