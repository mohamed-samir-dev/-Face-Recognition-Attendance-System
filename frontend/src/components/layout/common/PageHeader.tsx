interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="text-center mb-4 sm:mb-6 md:mb-8 px-2">
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1.5 sm:mb-2 md:mb-3 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}