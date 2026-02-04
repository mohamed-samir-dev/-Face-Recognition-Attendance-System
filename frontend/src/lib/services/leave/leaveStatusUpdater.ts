import { checkAndUpdateEmployeeStatuses } from './leaveService';

export const startLeaveStatusUpdater = () => {
  checkAndUpdateEmployeeStatuses();
  
  const interval = setInterval(() => {
    checkAndUpdateEmployeeStatuses();
  }, 60000); // Check every minute
  
  return () => clearInterval(interval);
};
