"use client";
import {AuthenticationStatusProps}from "../../../types"


export default function AuthenticationStatus({ recognizedEmployee }: AuthenticationStatusProps) {
  if (!recognizedEmployee) return null;

  const isUnauthorized = recognizedEmployee.id === "unknown" || recognizedEmployee.id === "unauthorized";
  
  return (
    <div className={`mt-4 p-4 rounded-lg text-center ${
      isUnauthorized
        ? "bg-red-50 border border-red-200" 
        : "bg-green-50 border border-green-200"
    }`}>

      
    </div>
  );
}