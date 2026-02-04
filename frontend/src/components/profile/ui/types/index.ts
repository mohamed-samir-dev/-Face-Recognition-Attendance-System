export interface ProfileImageProps {
    selectedImage: string | null;
    userImage: string;
    userName: string;
    onCameraClick: () => void;
  }
  export interface UploadButtonProps {
    onClick: () => void;
  }
  export interface FileInputProps {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }