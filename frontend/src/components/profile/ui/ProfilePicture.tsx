import { useRef, forwardRef, useImperativeHandle } from "react";
import { ProfilePictureProps } from "../types";
import { ProfileImage, UploadButton, FileInput } from "./profile-picture";

export interface ProfilePictureRef {
  triggerFileInput: () => void;
}

const ProfilePicture = forwardRef<ProfilePictureRef, ProfilePictureProps>(
  function ProfilePicture(
    { selectedImage, userImage, userName, onImageChange },
    ref
  ) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      triggerFileInput: () => fileInputRef.current?.click(),
    }));

    const handleFileInputClick = () => fileInputRef.current?.click();

    return (
      <div className="mb-6 sm:mb-8">
        <div className="rounded-xl">
          <h3 className="text-black text-base sm:text-lg font-semibold mb-4 sm:mb-6">
            Profile Picture
          </h3>
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8">
            <ProfileImage
              selectedImage={selectedImage}
              userImage={userImage}
              userName={userName}
              onCameraClick={handleFileInputClick}
            />
            <UploadButton onClick={handleFileInputClick} />
          </div>
          <FileInput ref={fileInputRef} onChange={onImageChange} />
        </div>
      </div>
    );
  }
);

export default ProfilePicture;
