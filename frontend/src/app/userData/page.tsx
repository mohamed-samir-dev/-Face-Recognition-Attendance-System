import { Suspense } from "react";
import DashboardPageContent from "./components/DashboardPageContent";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardPageContent />
    </Suspense>
  );
}
