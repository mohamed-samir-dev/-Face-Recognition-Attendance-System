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
  showFaceLogin: boolean;
  onCancelFaceLogin: () => void;
}

export interface FaceLoginResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    numericId: number;
    accountType: string;
    department: string;
    email: string;
    username: string;
    position: string;
    status: string;
  };
  message: string;
}
