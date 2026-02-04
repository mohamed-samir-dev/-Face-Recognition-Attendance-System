interface FaceRecognitionResponse {
  success: boolean;
  name?: string;
  message?: string;
  error?: string;
}

export async function recognizeFace(imageData: string): Promise<FaceRecognitionResponse> {
  try {
    console.log('Attempting face recognition request to localhost:5001');
    
    const response = await fetch("http://localhost:5001/recognize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        image: imageData
      })
    });

    console.log('Face recognition response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Face recognition server error:', errorText);
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Face recognition result:', result);
    return result;
  } catch (error) {
    console.error('Face recognition fetch error:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Face recognition server not running. Please start servers on ports 5000 and 5001.');
    }
    throw error;
  }
}