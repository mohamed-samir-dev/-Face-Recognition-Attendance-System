import { forwardRef } from "react";

interface VideoElementProps {
  cameraActive: boolean;
}

const VideoElement = forwardRef<HTMLVideoElement, VideoElementProps>(
  ({ cameraActive }, ref) => {
    return (
      <video
        ref={ref}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover rounded-xl ${
          !cameraActive ? "hidden" : ""
        }`}
      />
    );
  }
);

VideoElement.displayName = "VideoElement";

export default VideoElement;