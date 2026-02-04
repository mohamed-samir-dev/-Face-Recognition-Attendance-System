interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="text-center mb-6 sm:mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm sm:text-base text-gray-600">{subtitle}</p>
      )}
    </div>
  );
}