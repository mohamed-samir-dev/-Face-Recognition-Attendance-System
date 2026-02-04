export default function BarChart() {
  return (
    <div className="h-40 rounded-2xl p-4">
      <div className="flex items-end justify-between h-full space-x-2">
        {[60, 70, 80, 75, 85, 90].map((height, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className="w-8 bg-gradient-to-t from-blue-400 to-emerald-400 rounded-t shadow-sm"
              style={{ height: `${height}%` }}
            ></div>
            <span className="text-xs text-[#555] mt-2">
              {["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][index]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}