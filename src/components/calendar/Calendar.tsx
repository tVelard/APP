import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Plus, Dumbbell } from 'lucide-react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns'
import { fr } from 'date-fns/locale'
import { useWorkouts } from '@/hooks/useWorkouts'
import type { Workout } from '@/types/database'

interface CalendarProps {
  onDateSelect: (date: Date) => void
  onWorkoutSelect: (workout: Workout) => void
}

export function Calendar({ onDateSelect, onWorkoutSelect }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const { getWorkoutsByMonth, loading } = useWorkouts()

  useEffect(() => {
    loadWorkouts()
  }, [currentMonth])

  const loadWorkouts = async () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const { data } = await getWorkoutsByMonth(year, month)
    if (data) {
      setWorkouts(data)
    }
  }

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    onDateSelect(date)
  }

  const getWorkoutsForDate = (date: Date) => {
    return workouts.filter((w) => isSameDay(new Date(w.date), date))
  }

  // Générer les jours du calendrier
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: fr })}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              Aujourd'hui
            </button>
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Mois précédent"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Mois suivant"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-medium text-gray-500 uppercase"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grille des jours */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dayWorkouts = getWorkoutsForDate(day)
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const isDayToday = isToday(day)

          return (
            <div
              key={index}
              className={`
                min-h-[80px] md:min-h-[100px] p-1 border-b border-r border-gray-100
                ${!isCurrentMonth ? 'bg-gray-50' : 'bg-white'}
                ${index % 7 === 6 ? 'border-r-0' : ''}
              `}
            >
              <button
                onClick={() => handleDateClick(day)}
                className={`
                  w-full h-full flex flex-col items-start p-1 rounded-lg transition-colors
                  hover:bg-gray-50
                  ${isSelected ? 'ring-2 ring-primary-500 ring-inset' : ''}
                `}
              >
                <span
                  className={`
                    inline-flex items-center justify-center w-7 h-7 text-sm rounded-full
                    ${isDayToday ? 'bg-primary-600 text-white font-medium' : ''}
                    ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-700'}
                  `}
                >
                  {format(day, 'd')}
                </span>

                {/* Indicateurs de séances */}
                <div className="flex-1 w-full mt-1 space-y-0.5 overflow-hidden">
                  {dayWorkouts.slice(0, 2).map((workout) => (
                    <button
                      key={workout.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        onWorkoutSelect(workout)
                      }}
                      className="w-full flex items-center gap-1 px-1.5 py-0.5 bg-primary-100 text-primary-700 rounded text-xs truncate hover:bg-primary-200 transition-colors"
                    >
                      <Dumbbell className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{workout.name}</span>
                    </button>
                  ))}
                  {dayWorkouts.length > 2 && (
                    <span className="text-xs text-gray-500 pl-1">
                      +{dayWorkouts.length - 2} autres
                    </span>
                  )}
                </div>

                {/* Bouton ajouter (visible au hover sur desktop) */}
                {isCurrentMonth && dayWorkouts.length === 0 && (
                  <div className="hidden md:flex absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* Loader */}
      {loading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
