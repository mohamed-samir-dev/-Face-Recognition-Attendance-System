import { getUsers, updateUser } from '../user/userService';
import { updateDepartment, getCompanySettings } from '../system/settingsService';
import { User } from '@/lib/types';

export const handleSupervisorReplacement = async (
  newSupervisorData: {
    name: string;
    email: string;
    department: string;
    accountType: string;
  }
): Promise<{ oldSupervisor: User | null; needsNotification: boolean }> => {
  if (newSupervisorData.accountType !== 'Supervisor') {
    return { oldSupervisor: null, needsNotification: false };
  }

  try {
    // Get all users and find current supervisor of the department
    const users = await getUsers();
    const currentSupervisor = users.find(user => 
      (user.department === newSupervisorData.department || user.Department === newSupervisorData.department) && 
      user.accountType === 'Supervisor'
    );

    // If there's a current supervisor and it's not the same person being updated
    if (currentSupervisor && currentSupervisor.email !== newSupervisorData.email) {
      // Demote current supervisor to Employee
      await updateUser(currentSupervisor.id, {
        accountType: 'Employee' as 'Employee' | 'Admin' | 'Manager'
      });

      return { oldSupervisor: currentSupervisor, needsNotification: true };
    }

    return { oldSupervisor: null, needsNotification: false };
  } catch (error) {
    console.error('Error handling supervisor replacement:', error);
    throw error;
  }
};

export const updateDepartmentSupervisor = async (supervisorId: string, supervisorName: string, department: string) => {
  try {
    const settings = await getCompanySettings();
    const dept = settings.departments.find(d => d.name === department);
    
    if (dept) {
      await updateDepartment(dept.id, {
        head: supervisorName,
        headId: supervisorId
      });
    }
  } catch (error) {
    console.error('Error updating department supervisor:', error);
  }
};

export const sendSupervisorDemotionEmail = async (oldSupervisor: User, newSupervisor: string, department: string) => {
  try {
    await fetch('/api/send-supervisor-demotion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: oldSupervisor.name,
        email: oldSupervisor.email,
        department,
        newSupervisor,
      }),
    });
  } catch (error) {
    console.error('Error sending supervisor demotion email:', error);
  }
};