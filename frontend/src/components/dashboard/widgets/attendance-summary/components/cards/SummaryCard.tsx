import { SummaryCardProps } from "../../../../types";

export function SummaryCard({
  title,
  value,
  color = "blue",
  icon,
  timer,
  overtimeTimer,
}: SummaryCardProps) {
  const colorClasses = {
    blue: "from-blue-50 to-blue-100 border-blue-200",
    yellow: "from-amber-50 to-orange-100 border-amber-200",
    red: "from-red-50 to-red-100 border-red-200",
    green: "from-green-50 to-green-100 border-green-200",
  };

  const iconColors = {
    blue: "text-blue-600",
    yellow: "text-amber-600",
    red: "text-red-600",
    green: "text-green-600",
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-4 sm:p-5 md:p-6">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h4 className="text-xs sm:text-sm font-semibold text-[#555] line-clamp-2">{title}</h4>
        <div
          className={`p-1.5 sm:p-2 rounded-full bg-linear-to-r ${colorClasses[color]} shrink-0`}
        >
          <div className={iconColors[color]}>{icon}</div>
        </div>
      </div>
      {value !== undefined && (
        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-1">{value}</div>
      )}
      {timer && (
        <div>
          <div className="text-sm sm:text-base md:text-lg font-bold text-blue-700 tracking-wider">
            <span className="text-xs sm:text-sm md:text-base">Today Hour:</span> {timer}
          </div>
        </div>
      )}
      {overtimeTimer && (
        <div>
          <div className="text-sm sm:text-base md:text-lg font-bold text-green-700 tracking-wider">
            <span className="text-xs sm:text-sm md:text-base">Overtime:</span> {overtimeTimer}
          </div>
        </div>
      )}
    </div>
  );
}