import { getCompanySettings } from '../system/settingsService';

export const getSupervisorByDepartment = async (departmentName: string): Promise<string> => {
  try {
    const settings = await getCompanySettings();
    const department = settings.departments.find(dept => dept.name === departmentName);
    return department?.head || '';
  } catch (error) {
    console.error('Error fetching supervisor:', error);
    return '';
  }
};