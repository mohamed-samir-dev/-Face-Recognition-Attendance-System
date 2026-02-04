import { User } from "@/lib/types";
import {ThreeStepVerificationResult}from "../../types/services"

export async function performThreeStepAuthentication(
  capturedImageData: string,
  user: User
): Promise<ThreeStepVerificationResult> {
  try {
    console.log(`Starting three-step authentication for ${user.name} (ID: ${user.numericId})`);
    
    const response = await fetch("http://localhost:5001/three-step-verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: capturedImageData,
        expected_numeric_id: user.numericId
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    const result: ThreeStepVerificationResult = await response.json();
    
    // Log detailed results for debugging
    console.log("Two-step authentication results:", {
      step1: result.step1_face_recognition.success ? "✓ PASSED" : "✗ FAILED",
      step2: result.step2_numeric_id_verification.success ? "✓ PASSED" : "✗ FAILED",
      overall: result.overall_success ? "✓ SUCCESS" : "✗ FAILED"
    });

    return result;
  } catch (error) {
    console.error("Three-step authentication error:", error);
    
    return {
      step1_face_recognition: {
        success: false,
        message: "Connection error - unable to reach face recognition server"
      },
      step2_numeric_id_verification: {
        success: false,
        message: "Verification not attempted due to connection error"
      },
      overall_success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

export function getDetailedErrorMessage(result: ThreeStepVerificationResult): string {
  if (result.overall_success) {
    return result.message || "Authentication successful";
  }

  if (result.error) {
    return result.error;
  }

  // Determine which step failed and provide specific error message
  if (!result.step1_face_recognition.success) {
    return `Step 1 Failed - Face Recognition: ${result.step1_face_recognition.message}`;
  }

  if (!result.step2_numeric_id_verification.success) {
    const msg = result.step2_numeric_id_verification.message ||
      `Numeric ID mismatch`;
    return `Step 2 Failed - Numeric ID Verification: ${msg}`;
  }

  return "Authentication failed for unknown reason";
}

export function getSuccessMessage(result: ThreeStepVerificationResult): string {
  if (!result.overall_success) {
    return "";
  }

  const recognizedName = result.step1_face_recognition.recognized_name;
  const verifiedId = result.step2_numeric_id_verification.firebase_numeric_id;
  
  return `✓ Authentication Successful!\n` +
         `Face: ${recognizedName}\n` +
         `ID: ${verifiedId} (Verified)\n` +
         `All security checks passed.`;
}