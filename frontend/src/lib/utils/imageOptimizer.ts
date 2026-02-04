// Image optimization utilities for faster face recognition
export function resizeImageForComparison(canvas: HTMLCanvasElement, maxWidth: number = 640, maxHeight: number = 480): string {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas.toDataURL('image/jpeg', 0.8);

  const { width, height } = canvas;
  
  // Calculate new dimensions while maintaining aspect ratio
  let newWidth = width;
  let newHeight = height;
  
  if (width > maxWidth || height > maxHeight) {
    const aspectRatio = width / height;
    
    if (width > height) {
      newWidth = maxWidth;
      newHeight = maxWidth / aspectRatio;
    } else {
      newHeight = maxHeight;
      newWidth = maxHeight * aspectRatio;
    }
  }
  
  // Create a new canvas with optimized size
  const optimizedCanvas = document.createElement('canvas');
  optimizedCanvas.width = newWidth;
  optimizedCanvas.height = newHeight;
  
  const optimizedCtx = optimizedCanvas.getContext('2d');
  if (!optimizedCtx) return canvas.toDataURL('image/jpeg', 0.8);
  
  // Draw the resized image
  optimizedCtx.drawImage(canvas, 0, 0, newWidth, newHeight);
  
  // Return as compressed JPEG
  return optimizedCanvas.toDataURL('image/jpeg', 0.8);
}

export function compressBase64Image(base64Image: string, quality: number = 0.8): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(base64Image);
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    
    img.src = base64Image;
  });
}