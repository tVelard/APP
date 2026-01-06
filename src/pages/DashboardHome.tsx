import { useNavigate } from 'react-router-dom'
import { Target } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { CalendarWidget } from '@/components/dashboard/CalendarWidget'
import { StatsWidget } from '@/components/dashboard/StatsWidget'
import { PlaceholderWidget } from '@/components/dashboard/PlaceholderWidget'

export function DashboardHome() {
  const navigate = useNavigate()

  const handleCalendarNavigate = () => {
    navigate('/calendar')
  }

  const handleStatsNavigate = () => {
    navigate('/statistics')
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Row 1: Calendar Widget + Stats Widget */}
          <CalendarWidget onNavigate={handleCalendarNavigate} />

          <StatsWidget onNavigate={handleStatsNavigate} />

          {/* Row 2: Wide Placeholder Rectangle */}
          <div className="md:col-span-2">
            <PlaceholderWidget
              title="Objectifs"
              description="Définissez et suivez vos objectifs"
              icon={Target}
              className="min-h-[200px]"
            />
          </div>
        </div>
      </main>
    </div>
  )
}
