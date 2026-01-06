import { useState, useEffect } from 'react'
import { ChevronRight, TrendingUp, Dumbbell, Target } from 'lucide-react'
import { useStatistics, GlobalStats } from '@/hooks/useStatistics'

interface StatsWidgetProps {
  onNavigate: () => void
}

export function StatsWidget({ onNavigate }: StatsWidgetProps) {
  const [stats, setStats] = useState<GlobalStats | null>(null)
  const { getGlobalStats, loading } = useStatistics()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    const { data } = await getGlobalStats(30)
    if (data) {
      setStats(data)
    }
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M kg`
    }
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}k kg`
    }
    return `${volume} kg`
  }

  return (
    <div
      onClick={onNavigate}
      className="bg-gray-800 rounded-2xl border border-gray-700 p-5 cursor-pointer hover:border-primary-500 transition-all hover:shadow-lg hover:shadow-primary-500/10 group"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-100">Statistiques</h3>
          <p className="text-sm text-gray-400">30 derniers jours</p>
        </div>
        <div className="p-2 bg-gray-700 rounded-lg group-hover:bg-primary-600 transition-colors">
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : stats ? (
        <div className="space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Dumbbell className="h-4 w-4 text-primary-400" />
                <span className="text-xs text-gray-400">Séances</span>
              </div>
              <p className="text-xl font-bold text-gray-100">
                {stats.totalWorkouts}
              </p>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-xs text-gray-400">Volume</span>
              </div>
              <p className="text-xl font-bold text-gray-100">
                {formatVolume(stats.totalVolume)}
              </p>
            </div>
          </div>

          {/* Most worked exercise */}
          {stats.mostWorkedExercise && (
            <div className="border-t border-gray-700 pt-3">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-orange-400" />
                <span className="text-xs text-gray-400">
                  Exercice favori
                </span>
              </div>
              <p className="text-sm text-gray-200 capitalize truncate">
                {stats.mostWorkedExercise.name}
              </p>
              <p className="text-xs text-gray-500">
                {stats.mostWorkedExercise.count} fois ce mois
              </p>
            </div>
          )}

          {/* Average per week */}
          <div className="text-center pt-2">
            <p className="text-2xl font-bold text-primary-400">
              {stats.averageWorkoutsPerWeek}
            </p>
            <p className="text-xs text-gray-500">séances/semaine en moyenne</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-sm text-gray-500">Aucune donnée disponible</p>
          <p className="text-xs text-gray-600 mt-1">
            Commencez à vous entraîner !
          </p>
        </div>
      )}
    </div>
  )
}
