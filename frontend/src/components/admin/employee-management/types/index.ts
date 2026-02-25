import { User } from "@/lib/types";
import { LucideIcon } from "lucide-react";
import { Department } from "@/components/admin/departments/types/index";
// Employee Management Types
export interface Employee {
  id: string;
  name: string;
  email: string;
  department?: string;
  status: "active" | "inactive";
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormData {
  name: string;
  email: string;
  department: string;
  jobTitle: string;
  salary: string;
  image: string;
  photo?: File | string;
  role?: string;
  supervisor?: string;
  emailError?: string;
  password?: string;
}
export interface DeleteModalState {
  isOpen: boolean;
  user: Employee | null;
}

export type FilterType = "all" | "active" | "inactive";
export type SortType = "name" | "email" | "department" | "status";

export interface AssignButtonProps {
  selectedUser: User | null;
  selectedDepartment: string;
  onAssign: () => void;
}

export interface DepartmentSelectProps {
  departments: Department[];
  selectedDepartment: string;
  onDepartmentSelect: (dept: string) => void;
}

export interface UserSelectProps {
  users: User[];
  selectedUser: User | null;
  onUserSelect: (user: User | null) => void;
}
export interface AssignmentFormProps {
  users: User[];
  departments: Department[];
  selectedUser: User | null;
  selectedDepartment: string;
  onUserSelect: (user: User | null) => void;
  onDepartmentSelect: (dept: string) => void;
  onAssign: () => void;
}
export interface DepartmentCardProps {
  department: Department;
  users: User[];
  onRemoveUser: (userId: string) => void;
}
export interface EmployeeCardProps {
  user: User;
  onRemove: (userId: string) => void;
}
export interface EmployeeGridProps {
  users: User[];
  onRemoveUser: (userId: string) => void;
}
export interface DepartmentListProps {
  departments: Department[];
  users: User[];
  searchQuery: string;
  onRemoveUser: (userId: string) => void;
}
export interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}
export interface ResetButtonProps {
  hasNewPhoto: boolean;
  onResetClick: () => void;
}
export interface UploadButtonProps {
  updating: boolean;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export interface FacialDataSectionProps {
  updating: boolean;
  hasNewPhoto: boolean;
  photoMessage: { type: "success" | "error"; text: string } | null;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetClick: () => void;
}
export interface InputFieldProps {
  label: string;
  icon: LucideIcon;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  min?: string;
  error?: string;
}
export interface SelectFieldProps {
  label: string;
  icon: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}
export interface BasicInfoFieldsProps {
  formData: FormData & { emailError?: string };
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  generatedUsername?: string;
  onNameChange?: (name: string) => void;
}


export interface URLInputProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}
export interface PhotoUploadSectionProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  imageOption: string;
  setImageOption: React.Dispatch<React.SetStateAction<string>>;
  photoError: string;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export interface StatusBadgeProps {
  status?: string;
  getStatusColor: (status?: string) => string;
  getStatusText: (status?: string) => string;
}
export interface UserActionsProps {
  user: User;
  deleting: string | null;
  onEdit: (userId: string) => void;
  onDelete: (user: User) => void;
  onChangePassword?: (user: User) => void;
  hideDelete?: boolean;
}
export interface UserCardProps {
  user: User;
  deleting: string | null;
  onEdit: (userId: string) => void;
  onDelete: (user: User) => void;
  onChangePassword?: (user: User) => void;
  getStatusColor: (status?: string) => string;
  getStatusText: (status?: string) => string;
  hideDelete?: boolean;
}
export interface UserHeaderProps {
  user: User;
  getStatusColor: (status?: string) => string;
  getStatusText: (status?: string) => string;
}
export interface UserCardsProps {
  users: User[];
  deleting: string | null;
  onEdit: (userId: string) => void;
  onDelete: (user: User) => void;
  onChangePassword?: (user: User) => void;
  getStatusColor: (status?: string) => string;
  getStatusText: (status?: string) => string;
  hideDelete?: boolean;
}

export interface DepartmentFilterProps {
  departmentFilter: string;
  setDepartmentFilter: (filter: string) => void;
  departments: Department[];
}

export interface UserFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filter: string;
  setFilter: (filter: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (filter: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  departments: Department[];
}
export interface ActionsCellProps {
  user: User;
  deleting: string | null;
  onEdit: (userId: string) => void;
  onDelete: (user: User) => void;
  onChangePassword?: (user: User) => void;
  hideDelete?: boolean;
}
export interface StatusCellProps {
  status?: string;
  getStatusColor: (status?: string) => string;
  getStatusText: (status?: string) => string;
}
export interface TableRowProps {
  user: User;
  deleting: string | null;
  onEdit: (userId: string) => void;
  onDelete: (user: User) => void;
  onChangePassword?: (user: User) => void;
  getStatusColor: (status?: string) => string;
  getStatusText: (status?: string) => string;
  hideDelete?: boolean;
}export interface UserTableProps {
  users: User[];
  deleting: string | null;
  onEdit: (userId: string) => void;
  onDelete: (user: User) => void;
  onChangePassword?: (user: User) => void;
  getStatusColor: (status?: string) => string;
  getStatusText: (status?: string) => string;
  hideDelete?: boolean;
}export interface FormContainerProps {
  formData: FormData & { emailError?: string };
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  imageOption: string;
  setImageOption: React.Dispatch<React.SetStateAction<string>>;
  photoError: string;
  loading: boolean;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  generatedUsername?: string;
  onNameChange?: (name: string) => void;
}

export 
interface FormFieldsProps {
  formData: FormData & { emailError?: string };
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  imageOption: string;
  setImageOption: React.Dispatch<React.SetStateAction<string>>;
  photoError: string;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  generatedUsername?: string;
  onNameChange?: (name: string) => void;
}
export interface EditFormContainerProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  loading: boolean;
  updating: boolean;
  hasNewPhoto: boolean;
  photoMessage: string;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetClick: () => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export interface EditFormFieldsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updating: boolean;
  hasNewPhoto: boolean;
  photoMessage: string;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetClick: () => void;
}

export interface EditFormModalsProps {
  showSuccess: boolean;
  showResetModal: boolean;
  setShowResetModal: (show: boolean) => void;
  handleResetPhoto: () => void;
}
export interface DeleteModalProps {
  isOpen: boolean;
  user: User | null;
  deleting: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}
export interface ResetPhotoModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}