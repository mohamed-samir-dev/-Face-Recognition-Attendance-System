// Central types export - add types here as they are created
export * from "../features/analytics/cards/SummaryCards";
import { User } from "@/lib/types";

import { LucideIcon } from "lucide-react";

export interface DepartmentStats {
  department: Department;
  employeeCount: number;
  budgetPerEmployee: number;
}

export interface DepartmentBreakdownProps {
  stats: DepartmentStats[];
  totalEmployees: number;
  largestDepartment: DepartmentStats;
  highestBudgetDept: DepartmentStats;
}

export interface AnalyticsDepartmentCardProps {
  stat: DepartmentStats;
  index: number;
  totalEmployees: number;
  largestDepartment: DepartmentStats;
  highestBudgetDept: DepartmentStats;
}

export interface SummaryCardsProps {
  departmentCount: number;
  totalEmployees: number;
  totalBudget: number;
}

export interface SummaryCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  colorClass: string;
}

export interface CardGridProps {
  cards: SummaryCardProps[];
}

export interface DepartmentAnalyticsReturn {
  departments: Department[];
  stats: DepartmentStats[];
  loading: boolean;
  totalEmployees: number;
  totalBudget: number;
  largestDepartment: DepartmentStats;
  highestBudgetDept: DepartmentStats;
}

export interface Department {
  id: string;
  name: string;
  head: string;
  headId?: string;
  description?: string;
  employeeCount?: number;
  budget?: number;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
}




export interface DepartmentActionsProps {
  department: Department;
  onEdit: (dept: Department) => void;
  onDelete: (dept: Department) => void;
}
export interface ManagementDepartmentCardProps {
  department: Department;
  onEdit: (dept: Department) => void;
  onDelete: (dept: Department) => void;
}
export interface DepartmentInfoProps {
  department: Department;
}
export interface DepartmentListProps {
  departments: Department[];
  onEdit: (dept: Department) => void;
  onDelete: (dept: Department) => void;
}

export interface FormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  submitText?: string;
}
export interface DepartmentBudgetFieldProps {
  value: string;
  onChange: (value: string) => void;
}
export interface DepartmentDescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
}
export interface DepartmentHeadFieldProps {
  headId: string;
  users: User[];
  onChange: (headId: string, headName: string) => void;
}
export interface DepartmentLocationFieldProps {
  value: string;
  onChange: (value: string) => void;
}
export interface DepartmentNameFieldProps {
  value: string;
  onChange: (value: string) => void;
}
export interface NewDepartment {
  name: string;
  head: string;
  headId: string;
  description: string;
  budget: string;
  location: string;
}
export interface DepartmentFormFieldsProps {
  newDepartment: NewDepartment;
  setNewDepartment: React.Dispatch<React.SetStateAction<NewDepartment>>;
  users: User[];
}
export interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}
export interface AddDepartmentFormProps {
  newDepartment: NewDepartment;
  setNewDepartment: React.Dispatch<React.SetStateAction<NewDepartment>>;
  users: User[];
  onAdd: () => void;
  onCancel: () => void;
}

export interface DeleteConfirmModalProps {
  department: Department;
  onConfirm: () => void;
  onCancel: () => void;
}
export interface EditBudgetFieldProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}
export interface EditDescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
}
export interface EditHeadFieldProps {
  headId: string;
  users: User[];
  onChange: (headId: string, headName: string) => void;
}
export interface EditLocationFieldProps {
  value: string;
  onChange: (value: string) => void;
}
export interface EditNameFieldProps {
  value: string;
  onChange: (value: string) => void;
}
export interface EditDepartmentFieldsProps {
  editingDept: Department;
  setEditingDept: React.Dispatch<React.SetStateAction<Department | null>>;
  users: User[];
}

export interface EditDepartmentModalProps {
  editingDept: Department;
  setEditingDept: React.Dispatch<React.SetStateAction<Department | null>>;
  users: User[];
  onSave: () => void;
  onCancel: () => void;
}
export interface ModalActionsProps {
  onCancel: () => void;
  onSave: () => void;
  saveText?: string;
}

export interface ManagementContentProps {
  departments: Department[];
  showAddForm: boolean;
  newDepartment: NewDepartment;
  setNewDepartment: React.Dispatch<React.SetStateAction<NewDepartment>>;
  users: User[];
  onAdd: () => void;
  onCancelAdd: () => void;
  onEdit: (dept: Department) => void;
  onDelete: (dept: Department) => void;
}
export interface DepartmentManagementProps {
  departments: Department[];
  onDepartmentsChange: () => void;
}
export interface ManagementModalsProps {
  editingDept: Department | null;
  setEditingDept: React.Dispatch<React.SetStateAction<Department | null>>;
  users: User[];
  onSave: () => void;
  deleteConfirm: { show: boolean; dept: Department | null };
  setDeleteConfirm: React.Dispatch<React.SetStateAction<{ show: boolean; dept: Department | null }>>;
  onDeleteConfirm: () => void;
  showSuccessMessage: boolean;
  successMessage: string;
}

