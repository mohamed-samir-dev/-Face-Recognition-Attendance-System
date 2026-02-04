"use client";

import LoginForm from "../forms/LoginForm";
import AuthDivider from "../common/AuthDivider";
import FacialRecognitionButton from "../facial-recognition/FacialRecognitionButton";
import Card from "@/components/common/cards/Card";
import { LoginContainerProps } from "../types";

export default function LoginContainer({
  onLogin,
  onFacialRecognition,
  onClearSession,
  loading,
  faceLoading,
  error
}: LoginContainerProps) {
  return (
    <Card>
      <LoginForm 
        onSubmit={onLogin}
        loading={loading}
        error={error}
      />
      
      <AuthDivider />
      
      <FacialRecognitionButton onClick={onFacialRecognition} loading={faceLoading} />
      
      <p className="text-center text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4 leading-relaxed">
        Position your face in the frame with good lighting for accurate recognition.
      </p>
      
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={onClearSession}
          className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 underline cursor-pointer"
        >
          Clear saved session
        </button>
      </div>
    </Card>
  );
}
