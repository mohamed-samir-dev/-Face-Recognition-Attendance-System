import { getUsers } from "../user/userService";
import { User } from "@/lib/types";
import { compressBase64Image } from "@/lib/utils/imageOptimizer";
import { performanceMonitor } from "@/lib/utils/performanceMonitor";

// SECURITY: This service ensures only the logged-in user's image is used for comparison

// Cache for users to avoid repeated API calls
let usersCache: User[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getCachedUsers(): Promise<User[]> {
  const now = Date.now();
  if (usersCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return usersCache;
  }
  
  usersCache = await getUsers();
  cacheTimestamp = now;
  return usersCache;
}

export async function compareWithSpecificUser(capturedImageData: string, numericId: number): Promise<User | null> {
  const endTimer = performanceMonitor.startTimer('compareWithSpecificUser');
  
  try {
    console.log(`SECURITY: Comparing captured image with user ID ${numericId} ONLY`);
    const users = await getCachedUsers();
    
    // Find ONLY the specific user by numericId - no other users allowed
    const targetUser = users.find(user => user.numericId === numericId);
    
    if (!targetUser) {
      console.log(`SECURITY: User with ID ${numericId} not found in database`);
      return null;
    }
    
    if (!targetUser.image) {
      console.log(`SECURITY: User ${targetUser.name} (ID: ${numericId}) has no photo stored`);
      return null;
    }
    
    console.log(`SECURITY: Comparing captured image ONLY with ${targetUser.name} (ID: ${numericId})`);
    
    // Compare captured image with ONLY this specific user's stored photo
    const isMatch = await comparePhotos(capturedImageData, targetUser.image);
    console.log(`SECURITY: Photo match result for user ${numericId}: ${isMatch}`);
    
    if (isMatch) {
      console.log(`SECURITY: Photo verified for authorized user: ${targetUser.name} (ID: ${numericId})`);
      return targetUser;
    } else {
      console.log(`SECURITY: Photo does NOT match user ${targetUser.name} (ID: ${numericId}) - ACCESS DENIED`);
      return null;
    }
    
  } catch (error) {
    console.error("SECURITY: Error in user-specific photo comparison:", error);
    return null;
  } finally {
    endTimer();
  }
}

async function comparePhotos(capturedImage: string, userSpecificFirebaseImage: string): Promise<boolean> {
  const endTimer = performanceMonitor.startTimer('comparePhotos');
  
  try {
    console.log("SECURITY: Comparing captured image with user-specific Firebase image ONLY");
    
    // Validate that we have the user's specific image
    if (!userSpecificFirebaseImage) {
      console.log("SECURITY: No user-specific Firebase image provided");
      return false;
    }
    
    // Compress images to reduce processing time
    const [compressedCaptured, compressedUserImage] = await Promise.all([
      compressBase64Image(capturedImage, 0.7),
      compressBase64Image(userSpecificFirebaseImage, 0.7)
    ]);
    
    // Use AbortController for timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch("http://localhost:5001/compare", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image1: compressedCaptured,
        image2: compressedUserImage  // Only the specific user's image
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const result = await response.json();
      console.log("SECURITY: User-specific photo comparison result:", result);
      // Only accept exact match with the specific user's image
      return result.match === true;
    } else {
      const errorText = await response.text();
      console.log("SECURITY: Server error during user-specific comparison:", response.status, errorText);
      return false;
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error("SECURITY: User-specific photo comparison timed out");
    } else {
      console.error("SECURITY: User-specific photo comparison error:", error);
    }
    return false;
  } finally {
    endTimer();
  }
}

// Get specific user by numeric ID only - security function
export async function getUserByNumericId(numericId: number): Promise<User | null> {
  try {
    const users = await getCachedUsers();
    const user = users.find(u => u.numericId === numericId);
    
    if (user) {
      console.log(`SECURITY: Found user ${user.name} with ID ${numericId}`);
      return user;
    } else {
      console.log(`SECURITY: No user found with ID ${numericId}`);
      return null;
    }
  } catch (error) {
    console.error(`SECURITY: Error fetching user with ID ${numericId}:`, error);
    return null;
  }
}

// Clear cache when needed
export function clearUsersCache() {
  usersCache = null;
  cacheTimestamp = 0;
}

// Preload and cache user data for faster comparisons
export async function preloadUserData() {
  try {
    await getCachedUsers();
    console.log("User data preloaded and cached");
  } catch (error) {
    console.error("Failed to preload user data:", error);
  }
}

