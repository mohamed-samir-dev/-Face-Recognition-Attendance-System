export default function LineChart() {
  return (
    <div className="h-40 rounded-2xl p-4">
      <div className="relative h-full">
        <svg className="w-full h-full" viewBox="0 0 300 120">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
          <polyline
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            points="20,100 70,85 120,70 170,60 220,45 270,30"
          />
          <circle cx="20" cy="100" r="4" fill="#3B82F6" />
          <circle cx="70" cy="85" r="4" fill="#3B82F6" />
          <circle cx="120" cy="70" r="4" fill="#059669" />
          <circle cx="170" cy="60" r="4" fill="#059669" />
          <circle cx="220" cy="45" r="4" fill="#10B981" />
          <circle cx="270" cy="30" r="4" fill="#10B981" />
        </svg>
        <div className="flex justify-between mt-2 text-xs text-[#555]">
          <span>Jul</span>
          <span>Aug</span>
          <span>Sep</span>
          <span>Oct</span>
          <span>Nov</span>
          <span>Dec</span>
        </div>
      </div>
    </div>
  );
}