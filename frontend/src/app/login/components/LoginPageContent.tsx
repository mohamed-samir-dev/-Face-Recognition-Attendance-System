"use client";

import { useState, useEffect } from "react";
import { useLogin } from "../hooks/useLogin";
import LoginLayout from "../layouts/LoginLayout";
import LoginContainer from "./LoginContainer";
import SessionBlockedModal from "./SessionBlockedModal";

export default function LoginPageContent() {
  const [mounted, setMounted] = useState(false);
  const { error, loading, faceLoading, showFaceLogin, setShowFaceLogin, sessionBlocked, setSessionBlocked, blockedBy, handleLogin, handleFacialRecognition, handleClearSession } = useLogin();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <LoginLayout wide={showFaceLogin}>
      {sessionBlocked && (
        <SessionBlockedModal onClose={() => setSessionBlocked(false)} blockedBy={blockedBy} />
      )}
      <LoginContainer
        onLogin={handleLogin}
        onFacialRecognition={handleFacialRecognition}
        onClearSession={handleClearSession}
        loading={loading}
        faceLoading={faceLoading}
        error={error}
        showFaceLogin={showFaceLogin}
        onCancelFaceLogin={() => setShowFaceLogin(false)}
      />
    </LoginLayout>
  );
}