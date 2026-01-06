import { useState, useEffect } from 'react'
import { ChevronRight, Dumbbell } from 'lucide-react'
import { format, startOfWeek, addDays, isSameDay, isToday } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useWorkouts } from '@/hooks/useWorkouts'
import type { Workout } from '@/types/database'

interface CalendarWidgetProps {
  onNavigate: () => void
}

export function CalendarWidget({ onNavigate }: CalendarWidgetProps) {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const { getWorkoutsByMonth } = useWorkouts()
  const today = new Date()

  useEffect(() => {
    loadWorkouts()
  }, [])

  const loadWorkouts = async () => {
    const year = today.getFullYear()
    const month = today.getMonth()
    const { data } = await getWorkoutsByMonth(year, month)
    if (data) {
      setWorkouts(data)
    }
  }

  // Obtenir les jours de la semaine actuelle
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const getWorkoutsForDay = (date: Date) => {
    return workouts.filter((workout) =>
      isSameDay(new Date(workout.date), date)
    )
  }

  const todayWorkouts = getWorkoutsForDay(today)

  return (
    <div
      onClick={onNavigate}
      className="bg-gray-800 rounded-2xl border border-gray-700 p-5 cursor-pointer hover:border-primary-500 transition-all hover:shadow-lg hover:shadow-primary-500/10 group"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-100">Calendrier</h3>
          <p className="text-sm text-gray-400">
            {format(today, 'EEEE d MMMM', { locale: fr })}
          </p>
        </div>
        <div className="p-2 bg-gray-700 rounded-lg group-hover:bg-primary-600 transition-colors">
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
        </div>
      </div>

      {/* Mini week view */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {weekDays.map((day) => {
          const dayWorkouts = getWorkoutsForDay(day)
          const hasWorkout = dayWorkouts.length > 0
          const isCurrentDay = isToday(day)

          return (
            <div key={day.toISOString()} className="text-center">
              <div className="text-xs text-gray-500 mb-1">
                {format(day, 'EEE', { locale: fr }).charAt(0).toUpperCase()}
              </div>
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  isCurrentDay
                    ? 'bg-primary-600 text-white'
                    : hasWorkout
                    ? 'bg-green-900/50 text-green-400 border border-green-700'
                    : 'text-gray-400'
                }`}
              >
                {format(day, 'd')}
              </div>
            </div>
          )
        })}
      </div>

      {/* Today's workouts */}
      <div className="border-t border-gray-700 pt-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
          Aujourd'hui
        </p>
        {todayWorkouts.length > 0 ? (
          <div className="space-y-2">
            {todayWorkouts.slice(0, 2).map((workout) => (
              <div
                key={workout.id}
                className="flex items-center gap-2 p-2 bg-gray-700/50 rounded-lg"
              >
                <div className="w-8 h-8 bg-primary-600/20 rounded-lg flex items-center justify-center">
                  <Dumbbell className="h-4 w-4 text-primary-400" />
                </div>
                <span className="text-sm text-gray-200 truncate">
                  {workout.name}
                </span>
              </div>
            ))}
            {todayWorkouts.length > 2 && (
              <p className="text-xs text-gray-500">
                +{todayWorkouts.length - 2} autre(s)
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">Va faire du sport mon gros</p>
        )}
      </div>
    </div>
  )
}
