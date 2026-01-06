import { LucideIcon } from 'lucide-react'

interface PlaceholderWidgetProps {
  title: string
  description?: string
  icon?: LucideIcon
  className?: string
}

export function PlaceholderWidget({
  title,
  description = 'Bientôt disponible',
  icon: Icon,
  className = '',
}: PlaceholderWidgetProps) {
  return (
    <div
      className={`bg-gray-800 rounded-2xl border border-gray-700 p-5 flex flex-col items-center justify-center ${className}`}
    >
      {Icon && (
        <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center mb-3">
          <Icon className="h-6 w-6 text-gray-500" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-400">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  )
}
