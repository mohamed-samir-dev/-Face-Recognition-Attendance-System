// Performance monitoring for face recognition operations
class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(operation: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (!this.metrics.has(operation)) {
        this.metrics.set(operation, []);
      }
      
      const times = this.metrics.get(operation)!;
      times.push(duration);
      
      // Keep only last 10 measurements
      if (times.length > 10) {
        times.shift();
      }
      
      console.log(`${operation} completed in ${duration.toFixed(2)}ms`);
    };
  }

  getAverageTime(operation: string): number {
    const times = this.metrics.get(operation);
    if (!times || times.length === 0) return 0;
    
    const sum = times.reduce((a, b) => a + b, 0);
    return sum / times.length;
  }

  getMetrics(): Record<string, { average: number; count: number }> {
    const result: Record<string, { average: number; count: number }> = {};
    
    for (const [operation, times] of this.metrics.entries()) {
      result[operation] = {
        average: this.getAverageTime(operation),
        count: times.length
      };
    }
    
    return result;
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();