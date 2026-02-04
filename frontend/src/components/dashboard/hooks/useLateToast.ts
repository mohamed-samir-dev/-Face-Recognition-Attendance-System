import { useState, useEffect } from "react";

export function useLateToast() {
  const [showLateToast, setShowLateToast] = useState(false);

  useEffect(() => {
    const shouldShowLateToast = localStorage.getItem("showLateToast");
    if (shouldShowLateToast === "true") {
      setShowLateToast(true);
      localStorage.removeItem("showLateToast");
    }
  }, []);

  return {
    showLateToast,
    setShowLateToast,
  };
}