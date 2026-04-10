import {ReasonItemProps}from "../../types"
export default function ReasonItem({ reason }: ReasonItemProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1 sm:mb-2">
        <span className="text-sm sm:text-base text-gray-700">{reason.reason}</span>
        <span className="text-xs sm:text-sm font-medium text-gray-900">{reason.percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-green-500 h-2 rounded-full" 
          style={{ width: `${reason.percentage}%` }}
        ></div>
      </div>
    </div>
  );
}