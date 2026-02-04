
export interface ProfilePictureRef {
  triggerFileInput: () => void;
}

export interface NotificationSettingsProps {
    formData: {
      attendanceReminders: boolean;
      leaveStatusUpdates: boolean;
      systemAnnouncements: boolean;
    };
    onInputChange: (field: string, value: boolean) => void;
  }
  
  export interface PersonalInfoFormProps {
    formData: {
      fullName: string;
      email: string;
      phone: string;
      jobTitle: string;
      department: string;
      employeeId: string;
    };
    userPassword: string;
    userNumericId: string;
    onInputChange: (field: string, value: string | boolean) => void;
    onPasswordModalOpen: () => void;
  }


  export interface NotificationItemProps {
    title: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
  }
  
  export interface NotificationListProps {
    formData: {
      attendanceReminders: boolean;
      leaveStatusUpdates: boolean;
      systemAnnouncements: boolean;
    };
    onInputChange: (field: string, value: boolean) => void;
  }
  export interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
  }
  

  export interface InputFieldProps {
    label: string;
    type?: string;
    value: string;
    onChange?: (value: string) => void;
    readOnly?: boolean;
    placeholder?: string;
  }
  
  export interface PasswordFieldProps {
    userPassword: string;
    onPasswordModalOpen: () => void;
  }

  export interface PersonalInfoGridProps {
    formData: {
      fullName: string;
      email: string;
      phone: string;
      jobTitle: string;
      department: string;
    };
    userNumericId: string;
    onInputChange: (field: string, value: string) => void;
  }
  
  export interface User {
    id: string;
  numericId?: number;
  name: string;
  username: string;
  email?: string;
  image: string;
  password?: string;
  department?: string;
  Department?: string;
  jobTitle?: string;
  status?: 'Active' | 'OnLeave' | 'Inactive';
  salary?: number;
  phone?: string;
  // Session data
  lastLogin?: Date;
  isActive?: boolean;
  sessionStartTime?: Date;
  accountType?: 'Employee' | 'Admin' | 'Manager' | 'Supervisor';
  // Notification preferences
  systemAnnouncements?: boolean;
  leaveStatusUpdates?: boolean;
  attendanceReminders?: boolean;
  }

  export interface FormData {
    fullName: string;
    email: string;
    phone: string;
    jobTitle: string;
    department: string;
    employeeId: string;
    attendanceReminders: boolean;
    leaveStatusUpdates: boolean;
    systemAnnouncements: boolean;
    attendanceHistoryVisibility: string;
  }

  export interface ProfileContentProps {
    profilePictureRef: React.RefObject<ProfilePictureRef | null>;
    selectedImage: string | null;
    user: User;
    formData: FormData;
    handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    handleInputChange: (field: string, value: string | boolean) => void;
    setShowPasswordModal: (show: boolean) => void;
  }
  
  export interface PrivacySettingsProps {
    attendanceHistoryVisibility: string;
    onInputChange: (field: string, value: string) => void;
  }
  
  export interface ActionButtonsProps {
    onCancel: () => void;
    onSave: () => void;
  }

export interface ProfileSidebarProps {
  user: User;
  onUpdatePicture: () => void;
  onChangePassword: () => void;
}


  export interface ProfileLayoutProps {
    user: User;
    onLogout: () => void;
    onDashboard: () => void;
    onReports: () => void;
    onSettings: () => void;
    children: React.ReactNode;
  }



  export interface PasswordModalProps {
    showPasswordModal: boolean;
    passwordData: { current: string; new: string; confirm: string };
    showCurrentPassword: boolean;
    showNewPassword: boolean;
    showConfirmPassword: boolean;
    passwordError: string;
    onClose: () => void;
    onPasswordChange: (field: 'current' | 'new' | 'confirm', value: string) => void;
    onPasswordUpdate: () => void;
    onToggleCurrentPassword: () => void;
    onToggleNewPassword: () => void;
    onToggleConfirmPassword: () => void;
  }



  export interface ProfilePictureProps {
    selectedImage: string | null;
    userImage: string;
    userName: string;
    onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }

  export interface PasswordInputProps {
    label: string;
    value: string;
    placeholder: string;
    showPassword: boolean;
    onChange: (value: string) => void;
    onToggleVisibility: () => void;
    helperText?: string;
  }