export interface FaceDetectionResult {
  isValid: boolean;
  message: string;
}

export async function validateFaceInCircle(
  videoElement: HTMLVideoElement
): Promise<FaceDetectionResult> {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    
    if (!context) {
      return {
        isValid: false,
        message: "Unable to process image",
      };
    }

    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0);
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const circleRadius = Math.min(canvas.width, canvas.height) * 0.35;
    
    const faceDetected = detectFaceInRegion(imageData, centerX, centerY, circleRadius);
    
    if (!faceDetected) {
      return {
        isValid: false,
        message: "No face detected in circle. Please position your face properly.",
      };
    }
    
    return {
      isValid: true,
      message: "Face detected correctly",
    };
  } catch (error) {
    return {
      isValid: false,
      message: "Face detection failed. Please try again.",
    };
  }
}

function detectFaceInRegion(
  imageData: ImageData,
  centerX: number,
  centerY: number,
  radius: number
): boolean {
  const data = imageData.data;
  const width = imageData.width;
  
  let totalBrightness = 0;
  let pixelCount = 0;
  
  const sampleSize = 50;
  for (let i = 0; i < sampleSize; i++) {
    for (let j = 0; j < sampleSize; j++) {
      const angle = (i / sampleSize) * Math.PI * 2;
      const r = (j / sampleSize) * radius;
      
      const x = Math.floor(centerX + r * Math.cos(angle));
      const y = Math.floor(centerY + r * Math.sin(angle));
      
      if (x >= 0 && x < width && y >= 0 && y < imageData.height) {
        const index = (y * width + x) * 4;
        const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3;
        totalBrightness += brightness;
        pixelCount++;
      }
    }
  }
  
  const avgBrightness = totalBrightness / pixelCount;
  return avgBrightness > 60 && avgBrightness < 200 && pixelCount > 100;
}
