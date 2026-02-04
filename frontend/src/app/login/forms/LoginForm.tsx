"use client";

import { LoginFormProps } from "../types";
import { useLoginForm } from "../hooks/useLoginForm";
import FormInput from "./components/FormInput";
import ErrorMessage from "./components/ErrorMessage";
import SubmitButton from "./components/SubmitButton";

export default function LoginForm({
  onSubmit,
  loading,
  error,
}: LoginFormProps) {
  const { formData, fieldErrors, handleInputChange } = useLoginForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <FormInput
        type="text"
        value={formData.email}
        onChange={(value) => handleInputChange("email", value)}
        placeholder="Username or Email"
        error={fieldErrors.email}
        disabled={loading}
      />

      <FormInput
        type="password"
        value={formData.password}
        onChange={(value) => handleInputChange("password", value)}
        placeholder="Password"
        error={fieldErrors.password}
        disabled={loading}
      />

      {error && <ErrorMessage message={error} />}

      <SubmitButton
        loading={loading}
        text="Continue"
        loadingText="Loading..."
      />
    </form>
  );
}
