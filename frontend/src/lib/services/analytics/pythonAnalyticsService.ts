import {PythonAnalyticsReport}from "../../types/services"


export const runPythonAnalytics = async (): Promise<PythonAnalyticsReport | null> => {
  try {
    const response = await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.warn('Python analytics failed:', response.statusText);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error running Python analytics:', error);
    return null;
  }
};