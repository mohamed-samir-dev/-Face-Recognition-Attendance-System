export const getStatusColor = (status: string) => {
  switch (status) {
    case "Approved": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Pending": return "bg-amber-50 text-amber-700 border-amber-200";
    case "Rejected": return "bg-red-50 text-red-700 border-red-200";
    default: return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export const statusTabs = ["All Request", "Pending", "Approve", "Rejected", "Expired"];