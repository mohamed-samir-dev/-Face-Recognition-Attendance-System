import { db } from "@/lib/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { recognizeFace } from "@/utils/faceRecognition";
import {FaceComparisonResult,Employee}from "../../types/services"

export async function compareAndRetrieveEmployee(capturedImageData: string): Promise<FaceComparisonResult> {
  try {
    // Step 1: Use trained model for initial recognition
    const recognitionResult = await recognizeFace(capturedImageData);
    
    if (!recognitionResult.success || !recognitionResult.name) {
      return {
        success: false,
        message: "Face not recognized by trained model"
      };
    }

    // Step 2: Get employee data from Firebase by name
    const employee = await getEmployeeByName(recognitionResult.name);
    
    if (!employee) {
      return {
        success: false,
        message: `Employee ${recognitionResult.name} not found in database`
      };
    }

    // Step 3: If employee has photo in Firebase, compare with it
    if (employee.photoUrl) {
      const firebaseComparisonResult = await compareWithFirebasePhoto(capturedImageData, employee.photoUrl);
      
      if (!firebaseComparisonResult) {
        return {
          success: false,
          message: "Face does not match Firebase photo"
        };
      }
    }

    return {
      success: true,
      employee,
      message: `Welcome ${employee.name}!`
    };

  } catch (error) {
    console.error("Face comparison error:", error);
    return {
      success: false,
      message: "Error during face comparison process"
    };
  }
}

async function getEmployeeByName(name: string): Promise<Employee | null> {
  try {
    const employeesRef = collection(db, "employees");
    const snapshot = await getDocs(employeesRef);
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      if (data.name?.toLowerCase() === name.toLowerCase()) {
        return {
          id: doc.id,
          name: data.name,
          email: data.email,
          department: data.department,
          position: data.position,
          photoUrl: data.photoUrl,
          phone: data.phone,
          address: data.address,
          salary: data.salary,
          hireDate: data.hireDate
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching employee:", error);
    return null;
  }
}

async function compareWithFirebasePhoto(capturedImage: string, firebasePhotoUrl: string): Promise<boolean> {
  try {
    // Convert Firebase photo URL to base64 for comparison
    const response = await fetch(firebasePhotoUrl);
    const blob = await response.blob();
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const firebaseImageBase64 = reader.result as string;
          
          // Send both images to Python server for comparison
          const comparisonResponse = await fetch("http://localhost:5001/compare", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image1: capturedImage,
              image2: firebaseImageBase64
            })
          });
          
          if (comparisonResponse.ok) {
            const result = await comparisonResponse.json();
            resolve(result.match === true);
          } else {
            resolve(true); // Fallback to true if comparison service unavailable
          }
        } catch (error) {
          console.error("Photo comparison error:", error);
          resolve(true); // Fallback to true if comparison fails
        }
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Firebase photo fetch error:", error);
    return true; // Fallback to true if Firebase photo unavailable
  }
}