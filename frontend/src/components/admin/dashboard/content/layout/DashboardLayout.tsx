import {DashboardLayoutProps} from "../../types"
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}