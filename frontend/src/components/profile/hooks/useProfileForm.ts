import { useState } from "react";
import { DocumentData } from "firebase/firestore";
import { updateUser } from "@/lib/services/user/userService";

export const useProfileForm = (user: DocumentData) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: user.name || "John Doe",
    email: user.email || "john.doe@techcorp.com",
    phone: user.phone || "",
    jobTitle: user.jobTitle || "Software Engineer",
    department: user.department || user.Department || "Engineering",
    employeeId: user.numericId || "",
    attendanceReminders: user.attendanceReminders ?? false,
    leaveStatusUpdates: user.leaveStatusUpdates ?? false,
    systemAnnouncements: user.systemAnnouncements ?? false,
    attendanceHistoryVisibility: user.attendanceHistoryVisibility || "team",
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a JPG, PNG, or GIF image.');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageUrl = e.target?.result as string;
        setSelectedImage(imageUrl);
        
        try {
          await updateUser(user.id, { image: imageUrl });
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
          console.error("Error updating profile picture:", error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const updateData: { 
        name: string; 
        email: string; 
        phone: string; 
        image?: string;
        attendanceReminders?: boolean;
        leaveStatusUpdates?: boolean;
        systemAnnouncements?: boolean;
        attendanceHistoryVisibility?: string;
      } = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        attendanceReminders: formData.attendanceReminders,
        leaveStatusUpdates: formData.leaveStatusUpdates,
        systemAnnouncements: formData.systemAnnouncements,
        attendanceHistoryVisibility: formData.attendanceHistoryVisibility,
      };

      if (selectedImage) {
        updateData.image = selectedImage;
      }

      await updateUser(user.id, updateData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return {
    formData,
    selectedImage,
    showSuccess,
    handleInputChange,
    handleImageChange,
    handleSave,
  };
};