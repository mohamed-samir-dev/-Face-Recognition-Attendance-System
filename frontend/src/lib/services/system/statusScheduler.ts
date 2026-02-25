import { checkAndUpdateEmployeeStatuses } from '../leave/leaveService';

class StatusScheduler {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.checkStatuses();
    
    this.intervalId = setInterval(() => {
      this.checkStatuses();
    }, 5 * 60 * 1000);
    
    console.log('Employee status scheduler started');
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  private async checkStatuses() {
    try {
      await checkAndUpdateEmployeeStatuses();
    } catch (error) {
      console.error('Error in status scheduler:', error);
    }
  }
}

export const statusScheduler = new StatusScheduler();