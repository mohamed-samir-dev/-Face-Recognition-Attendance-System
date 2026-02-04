export interface FacialRecognitionButtonProps {
  onClick: () => void;
  loading?: boolean;
}
export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  loading: boolean;
  error: string;
}

export interface FormInputProps {
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  disabled?: boolean;
}

export interface SubmitButtonProps {
  loading: boolean;
  text: string;
  loadingText: string;
}

export interface LoginContainerProps {
  onLogin: (formData: LoginFormData) => Promise<void>;
  onFacialRecognition: () => void;
  onClearSession: () => void;
  loading: boolean;
  faceLoading: boolean;
  error: string;
}
