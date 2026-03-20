

interface FaceRecognitionResponse {
  success: boolean;
  name?: string;
  recognized_name?: string;
  message?: string;
  error?: string;
}

const API_URL = process.env.NEXT_PUBLIC_FACE_RECOGNITION_URL || "http://localhost:5001";

/**
 * Recognize a face using the /face-login endpoint (no numericId needed).
 * Used for face-only login flow.
 */
export async function recognizeFace(imageData: string): Promise<FaceRecognitionResponse> {
  try {
    const response = await fetch(`${API_URL}/face-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageData }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    // Normalize response: map user.name to name for consistency
    if (result.success && result.user?.name) {
      result.name = result.user.name;
    }
    return result;
  } catch (error) {
    console.error("Face recognition fetch error:", error);
    throw error;
  }
}

/**
 * Recognize a face with numericId verification using /recognize endpoint.
 * Used for attendance marking (three-step auth).
 */
export async function recognizeFaceWithId(
  imageData: string,
  expectedNumericId: number
): Promise<FaceRecognitionResponse> {
  try {
    const response = await fetch(`${API_URL}/recognize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: imageData,
        expected_numeric_id: expectedNumericId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Face recognition with ID fetch error:", error);
    throw error;
  }
}
