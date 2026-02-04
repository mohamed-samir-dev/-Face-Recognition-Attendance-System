interface ProfileInfoProps {
  name: string;
  numericId: string;
  department: string;
  status?: 'Active' | 'OnLeave' | 'Inactive';
}

export default function ProfileInfo({ name, numericId, department, status }: ProfileInfoProps) {
  const getStatusColor = (status?: string) => {
    if (!status) return 'text-green-600';
    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus === 'active') return 'text-green-600';
    if (normalizedStatus === 'onleave' || normalizedStatus.includes('leave')) return 'text-orange-500';
    return 'text-red-600';
  };

  return (
    <div className="text-center sm:text-left">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1A1A1A] mb-2">
        {name || "Sophia Clark"}
      </h2>
      <p className="text-xs sm:text-sm text-[#555] mb-1">
        Employee ID: {numericId || "12345"}
      </p>
      <p className="text-xs sm:text-sm text-[#555] mb-1">
        Department: {department || "Not Assigned"}
      </p>
      <p className={`text-xs  sm:text-sm font-medium ${getStatusColor(status)}`}>
        Status: {status || "Active"}
      </p>
    </div>
  );
}