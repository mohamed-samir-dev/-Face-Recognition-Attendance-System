"use client";

import { useState, useEffect } from "react";
import { useLogin } from "../hooks/useLogin";
import LoginLayout from "../layouts/LoginLayout";
import LoginContainer from "./LoginContainer";

export default function LoginPageContent() {
  const [mounted, setMounted] = useState(false);
  const { error, loading, faceLoading, handleLogin, handleFacialRecognition, handleClearSession } = useLogin();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <LoginLayout>
      <LoginContainer
        onLogin={handleLogin}
        onFacialRecognition={handleFacialRecognition}
        onClearSession={handleClearSession}
        loading={loading}
        faceLoading={faceLoading}
        error={error}
      />
    </LoginLayout>
  );
}