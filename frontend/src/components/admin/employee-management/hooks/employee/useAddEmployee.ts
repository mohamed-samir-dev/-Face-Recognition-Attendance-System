'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithId } from '@/lib/services/user/userService';
import { generateProfessionalUsername } from '@/lib/services/user/usernameService';
import { generateStrongPassword } from '@/lib/services/user/passwordService';
import { validateEmailUniqueness } from '@/lib/services/user/emailValidationService';
import { getSupervisorByDepartment } from '@/lib/services/department/supervisorService';
import { handleSupervisorReplacement, sendSupervisorDemotionEmail, updateDepartmentSupervisor } from '@/lib/services/department/supervisorManagementService';
import {FormData} from "../../types"



export function useAddEmployee() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [showEmailWarning, setShowEmailWarning] = useState(false);
  const [existingUser, setExistingUser] = useState<Record<string, unknown> | null>(null);
  const [generatedUsername, setGeneratedUsername] = useState('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    department: '',
    jobTitle: '',
    salary: '',
    image: '',
    role: 'Employee',
    supervisor: '',
    password: '',
  });

  useEffect(() => {
    const updateSupervisor = async () => {
      if (formData.department) {
        const supervisor = await getSupervisorByDepartment(formData.department);
        setFormData(prev => ({ ...prev, supervisor }));
      } else {
        setFormData(prev => ({ ...prev, supervisor: '' }));
      }
    };
    updateSupervisor();
  }, [formData.department]);
  const [imageOption, setImageOption] = useState('upload');

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve('');
      const img = new Image();
      
      img.onload = () => {
        const maxWidth = 400;
        const maxHeight = 400;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressedImage = await compressImage(file);
      setFormData({ ...formData, image: compressedImage });
    }
  };

  const previewUsername = useCallback((name: string) => {
    const timeoutId = setTimeout(async () => {
      if (name.trim()) {
        try {
          const username = await generateProfessionalUsername(name);
          setGeneratedUsername(username);
        } catch  {
          setGeneratedUsername('');
        }
      } else {
        setGeneratedUsername('');
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image) {
      setPhotoError('Employee photo is required to complete registration');
      return;
    }
    
    setPhotoError('');
    setLoading(true);

    // Validate email uniqueness
    try {
      const emailValidation = await validateEmailUniqueness(formData.email);
      if (!emailValidation.isUnique && emailValidation.existingUser) {
        setExistingUser(emailValidation.existingUser);
        setShowEmailWarning(true);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error('Error validating email:', error);
      alert('Error validating email. Please try again.');
      setLoading(false);
      return;
    }

    try {
      const username = await generateProfessionalUsername(formData.name);
      const password = formData.password || generateStrongPassword();

      // Handle supervisor replacement if needed
      const { oldSupervisor, needsNotification } = await handleSupervisorReplacement({
        name: formData.name,
        email: formData.email,
        department: formData.department,
        accountType: formData.role || 'Employee'
      });

      const newUser = await createUserWithId({
        name: formData.name,
        username,
        email: formData.email,
        department: formData.department,
        jobTitle: formData.jobTitle,
        salary: parseInt(formData.salary),
        image: formData.image,
        password,
        status: 'Inactive',
        accountType: (formData.role || 'Employee') as 'Employee' | 'Admin' | 'Manager',
        supervisor: formData.supervisor,
      });

      // Update department supervisor if this is a supervisor
      if (formData.role === 'Supervisor') {
        await updateDepartmentSupervisor(newUser.id, formData.name, formData.department);
      }

      // Send demotion email if needed
      if (needsNotification && oldSupervisor) {
        await sendSupervisorDemotionEmail(oldSupervisor, formData.name, formData.department);
      }

      try {
        await fetch('/api/send-credentials', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            username,
            password,
            supervisor: formData.supervisor,
            accountType: formData.role || 'Employee',
            department: formData.department,
            jobTitle: formData.jobTitle,
          }),
        });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push('/admin');
      }, 2000);
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Error adding employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    showSuccess,
    photoError,
    showEmailWarning,
    setShowEmailWarning,
    existingUser,
    generatedUsername,
    formData,
    setFormData,
    imageOption,
    setImageOption,
    handleFileUpload,
    handleSubmit,
    previewUsername,
    router
  };
}