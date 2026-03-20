"use client";

import LoginForm from "../forms/LoginForm";
import AuthDivider from "../common/AuthDivider";
import FacialRecognitionButton from "../facial-recognition/FacialRecognitionButton";
import FaceLoginCamera from "../facial-recognition/FaceLoginCamera";
import Card from "@/components/common/cards/Card";
import { LoginContainerProps } from "../types";

export default function LoginContainer({
  onLogin,
  onFacialRecognition,
  onClearSession,
  loading,
  faceLoading,
  error,
  showFaceLogin,
  onCancelFaceLogin,
}: LoginContainerProps) {
  if (showFaceLogin) {
    return <FaceLoginCamera onCancel={onCancelFaceLogin} />;
  }

  return (
    <Card>
      <LoginForm 
        onSubmit={onLogin}
        loading={loading}
        error={error}
      />
      
      <AuthDivider />
      
      <FacialRecognitionButton onClick={onFacialRecognition} loading={faceLoading} />
      
      <p className="text-center text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3 md:mt-4 leading-relaxed px-2">
        Position your face in the frame with good lighting for accurate recognition.
      </p>
      
      <div className="mt-3 sm:mt-4 text-center">
        <button
          type="button"
          onClick={onClearSession}
          className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 underline cursor-pointer transition-colors duration-200"
        >
          Clear saved session
        </button>
      </div>
    </Card>
  );
}
