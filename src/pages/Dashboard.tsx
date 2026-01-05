import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Calendar } from '@/components/calendar/Calendar'
import { WorkoutModal } from '@/components/workout/WorkoutModal'
import { WorkoutDetail } from '@/components/workout/WorkoutDetail'
import type { Workout } from '@/types/database'

export function Dashboard() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setShowCreateModal(true)
  }

  const handleWorkoutSelect = (workout: Workout) => {
    setSelectedWorkout(workout)
  }

  const handleWorkoutCreated = (workout: Workout) => {
    setShowCreateModal(false)
    setSelectedWorkout(workout)
    setRefreshKey((k) => k + 1)
  }

  const handleBackToCalendar = () => {
    setSelectedWorkout(null)
    setRefreshKey((k) => k + 1)
  }

  const handleWorkoutDeleted = () => {
    setSelectedWorkout(null)
    setRefreshKey((k) => k + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {selectedWorkout ? (
          <WorkoutDetail
            workout={selectedWorkout}
            onBack={handleBackToCalendar}
            onDelete={handleWorkoutDeleted}
          />
        ) : (
          <Calendar
            key={refreshKey}
            onDateSelect={handleDateSelect}
            onWorkoutSelect={handleWorkoutSelect}
          />
        )}
      </main>

      {showCreateModal && selectedDate && (
        <WorkoutModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          selectedDate={selectedDate}
          onWorkoutCreated={handleWorkoutCreated}
        />
      )}
    </div>
  )
}
