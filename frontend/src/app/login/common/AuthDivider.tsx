export default function AuthDivider() {
  return (
    <div className="relative my-4 sm:my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300"></div>
      </div>
      <div className="relative flex justify-center text-xs sm:text-sm">
        <span className="px-3 sm:px-4 bg-white text-gray-500 font-medium">
          OR
        </span>
      </div>
    </div>
  );
}
