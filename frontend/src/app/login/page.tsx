import { Metadata } from "next";
import LoginPageContent from "./components/LoginPageContent";

export const metadata: Metadata = {
  title: "Login - Face Recognition Attendance System",
  description: "Login to access the attendance system"
};

/** Login page component */
export default function LoginPage() {
  return <LoginPageContent />;
}