"use client";

import { Suspense } from "react";
import AdminDashboardContent from "../content";
import LoadingSpinner from "../../ui/loading";

export default function AdminDashboardWrapper() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AdminDashboardContent />
    </Suspense>
  );
}