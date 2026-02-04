"use client";

import { AddDepartmentFormProps } from "../../../types";
import FormContainer from "./container/FormContainer";
import FormHeader from "./header/FormHeader";
import DepartmentFormFields from "./components/fields/DepartmentFormFields";
import FormActions from "./components/actions/FormActions";

export default function AddDepartmentForm({
  newDepartment,
  setNewDepartment,
  users,
  onAdd,
  onCancel,
}: AddDepartmentFormProps) {
  return (
    <FormContainer>
      <FormHeader title="Add New Department" />
      <DepartmentFormFields
        newDepartment={newDepartment}
        setNewDepartment={setNewDepartment}
        users={users}
      />
      <FormActions onCancel={onCancel} onSubmit={onAdd} />
    </FormContainer>
  );
}
