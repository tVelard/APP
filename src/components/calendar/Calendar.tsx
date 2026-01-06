import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Plus, Dumbbell, Calendar as CalendarIcon, LayoutGrid } from 'lucide-react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns'
import { fr } from 'date-fns/locale'
import { useWorkouts } from '@/hooks/useWorkouts'
import type { Workout } from '@/types/database'

type ViewMode = 'month' | 'week'

interface CalendarProps {
  onDateSelect: (date: Date) => void
  onWorkoutSelect: (workout: Workout) => void
}

export function Calendar({ onDateSelect, onWorkoutSelect }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>('month')
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const { getWorkoutsByMonth, loading } = useWorkouts()

  useEffect(() => {
    loadWorkouts()
  }, [currentDate, viewMode])

  const loadWorkouts = async () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const { data } = await getWorkoutsByMonth(year, month)
    if (data) {
      setWorkouts(data)
    }
  }

  const previous = () => {
    if (viewMode === 'month') {
      setCurrentDate(subMonths(currentDate, 1))
    } else {
      setCurrentDate(subWeeks(currentDate, 1))
    }
  }

  const next = () => {
    if (viewMode === 'month') {
      setCurrentDate(addMonths(currentDate, 1))
    } else {
      setCurrentDate(addWeeks(currentDate, 1))
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    onDateSelect(date)
  }

  const getWorkoutsForDate = (date: Date) => {
    return workouts.filter((w) => isSameDay(new Date(w.date), date))
  }

  // Générer les jours selon le mode d'affichage
  const getDays = () => {
    if (viewMode === 'week') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
      return eachDayOfInterval({ start: weekStart, end: weekEnd })
    } else {
      const monthStart = startOfMonth(currentDate)
      const monthEnd = endOfMonth(currentDate)
      const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
      const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
      return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
    }
  }

  const days = getDays()
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

  const getHeaderTitle = () => {
    if (viewMode === 'week') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
      return `${format(weekStart, 'd', { locale: fr })} - ${format(weekEnd, 'd MMMM yyyy', { locale: fr })}`
    }
    return format(currentDate, 'MMMM yyyy', { locale: fr })
  }

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-100 capitalize">
            {getHeaderTitle()}
          </h2>
          <div className="flex items-center gap-2">
            {/* Toggle vue mensuelle/hebdomadaire */}
            <div className="flex items-center bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('month')}
                className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'month'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                title="Vue mensuelle"
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Mois</span>
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'week'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                title="Vue hebdomadaire"
              >
                <CalendarIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Semaine</span>
              </button>
            </div>

            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-sm font-medium text-primary-400 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Aujourd'hui
            </button>
            <button
              onClick={previous}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              aria-label={viewMode === 'month' ? 'Mois précédent' : 'Semaine précédente'}
            >
              <ChevronLeft className="h-5 w-5 text-gray-400" />
            </button>
            <button
              onClick={next}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              aria-label={viewMode === 'month' ? 'Mois suivant' : 'Semaine suivante'}
            >
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 border-b border-gray-700">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-medium text-gray-400 uppercase"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grille des jours */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dayWorkouts = getWorkoutsForDate(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const isDayToday = isToday(day)
          const minHeight = viewMode === 'week' ? 'min-h-[150px] md:min-h-[200px]' : 'min-h-[80px] md:min-h-[100px]'

          return (
            <div
              key={index}
              className={`
                ${minHeight} p-1 border-b border-r border-gray-700
                ${!isCurrentMonth && viewMode === 'month' ? 'bg-gray-850 bg-opacity-50' : 'bg-gray-800'}
                ${index % 7 === 6 ? 'border-r-0' : ''}
              `}
            >
              <button
                onClick={() => handleDateClick(day)}
                className={`
                  w-full h-full flex flex-col items-start p-1 rounded-lg transition-colors
                  hover:bg-gray-700
                  ${isSelected ? 'ring-2 ring-primary-500 ring-inset' : ''}
                `}
              >
                <span
                  className={`
                    inline-flex items-center justify-center w-7 h-7 text-sm rounded-full
                    ${isDayToday ? 'bg-primary-600 text-white font-medium' : ''}
                    ${!isCurrentMonth && viewMode === 'month' ? 'text-gray-500' : 'text-gray-300'}
                  `}
                >
                  {format(day, 'd')}
                </span>

                {/* Indicateurs de séances */}
                <div className="flex-1 w-full mt-1 space-y-0.5 overflow-hidden">
                  {dayWorkouts.slice(0, viewMode === 'week' ? 5 : 2).map((workout) => (
                    <button
                      key={workout.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        onWorkoutSelect(workout)
                      }}
                      className="w-full flex items-center gap-1 px-1.5 py-0.5 bg-primary-900/50 text-primary-300 rounded text-xs truncate hover:bg-primary-800/50 transition-colors border border-primary-700/50"
                    >
                      <Dumbbell className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{workout.name}</span>
                    </button>
                  ))}
                  {dayWorkouts.length > (viewMode === 'week' ? 5 : 2) && (
                    <span className="text-xs text-gray-500 pl-1">
                      +{dayWorkouts.length - (viewMode === 'week' ? 5 : 2)} autres
                    </span>
                  )}
                </div>

                {/* Bouton ajouter (visible au hover sur desktop) */}
                {(isCurrentMonth || viewMode === 'week') && dayWorkouts.length === 0 && (
                  <div className="hidden md:flex absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="h-4 w-4 text-gray-500" />
                  </div>
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* Loader */}
      {loading && (
        <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
