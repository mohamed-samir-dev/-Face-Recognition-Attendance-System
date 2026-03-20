import { useState } from "react";
import { LoginFormData } from "../types";

export function useLoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validate = (): boolean => {
    const errors = { email: "", password: "" };
    let valid = true;

    if (!formData.email.trim()) {
      errors.email = "Username or email is required";
      valid = false;
    }

    if (!formData.password) {
      errors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 3) {
      errors.password = "Password is too short";
      valid = false;
    }

    setFieldErrors(errors);
    return valid;
  };

  return {
    formData,
    fieldErrors,
    handleInputChange,
    validate,
  };
}
