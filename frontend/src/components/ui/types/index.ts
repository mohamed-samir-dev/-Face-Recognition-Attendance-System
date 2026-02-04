


export interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  }
  
  




export interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    employeeName: string;
    username: string;
    password: string;
    employeeId: number;
  }