"use client";

import { Suspense } from "react";
import SupervisorDashboardContent from "../content";
import LoadingSpinner from "@/app/admin/components/ui/loading";

export default function SupervisorDashboardWrapper() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SupervisorDashboardContent />
    </Suspense>
  );
}
