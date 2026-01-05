import { useState, useEffect } from 'react'
import { X, Plus, Copy, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useWorkouts } from '@/hooks/useWorkouts'
import { useAuthContext } from '@/contexts/AuthContext'
import type { Workout } from '@/types/database'

interface WorkoutModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date
  onWorkoutCreated: (workout: Workout) => void
}

type CreationMode = 'select' | 'new' | 'duplicate'

export function WorkoutModal({ isOpen, onClose, selectedDate, onWorkoutCreated }: WorkoutModalProps) {
  const { user } = useAuthContext()
  const { createWorkout, duplicateWorkout, getAllWorkouts, loading } = useWorkouts()

  const [mode, setMode] = useState<CreationMode>('select')
  const [workoutName, setWorkoutName] = useState('')
  const [existingWorkouts, setExistingWorkouts] = useState<Workout[]>([])
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingWorkouts, setLoadingWorkouts] = useState(false)

  useEffect(() => {
    if (isOpen && mode === 'duplicate') {
      loadExistingWorkouts()
    }
  }, [isOpen, mode])

  useEffect(() => {
    if (isOpen) {
      setMode('select')
      setWorkoutName('')
      setSelectedWorkoutId(null)
      setError(null)
    }
  }, [isOpen])

  const loadExistingWorkouts = async () => {
    setLoadingWorkouts(true)
    const { data } = await getAllWorkouts()
    if (data) {
      setExistingWorkouts(data)
    }
    setLoadingWorkouts(false)
  }

  const handleCreateNew = async () => {
    if (!workoutName.trim()) {
      setError('Veuillez entrer un nom pour la séance')
      return
    }

    if (!user) return

    const { data, error: createError } = await createWorkout({
      user_id: user.id,
      name: workoutName.trim(),
      date: format(selectedDate, 'yyyy-MM-dd'),
      notes: null,
    })

    if (createError) {
      setError(createError.message)
      return
    }

    if (data) {
      onWorkoutCreated(data)
      onClose()
    }
  }

  const handleDuplicate = async () => {
    if (!selectedWorkoutId) {
      setError('Veuillez sélectionner une séance à dupliquer')
      return
    }

    const selectedWorkout = existingWorkouts.find(w => w.id === selectedWorkoutId)
    const newName = workoutName.trim() || selectedWorkout?.name

    const { data, error: duplicateError } = await duplicateWorkout(
      selectedWorkoutId,
      format(selectedDate, 'yyyy-MM-dd'),
      newName
    )

    if (duplicateError) {
      setError(duplicateError.message)
      return
    }

    if (data) {
      // Fetch the created workout to return it
      const { data: workouts } = await getAllWorkouts()
      const newWorkoutId = data as string; const newWorkout = workouts?.find(w => w.id === newWorkoutId)
      if (newWorkout) {
        onWorkoutCreated(newWorkout)
      }
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Nouvelle séance
            </h2>
            <p className="text-sm text-gray-500">
              {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {mode === 'select' && (
            <div className="space-y-3">
              <button
                onClick={() => setMode('new')}
                className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-colors"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Plus className="h-6 w-6 text-primary-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Nouvelle séance</h3>
                  <p className="text-sm text-gray-500">Créer une séance vide</p>
                </div>
              </button>

              <button
                onClick={() => setMode('duplicate')}
                className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-colors"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Copy className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Reprendre une séance</h3>
                  <p className="text-sm text-gray-500">Dupliquer une séance existante</p>
                </div>
              </button>
            </div>
          )}

          {mode === 'new' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="workoutName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la séance
                </label>
                <input
                  id="workoutName"
                  type="text"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  placeholder="Ex: Push, Jambes, Full Body..."
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setMode('select')}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Retour
                </button>
                <button
                  onClick={handleCreateNew}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    'Créer'
                  )}
                </button>
              </div>
            </div>
          )}

          {mode === 'duplicate' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sélectionner une séance à dupliquer
                </label>

                {loadingWorkouts ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                  </div>
                ) : existingWorkouts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Aucune séance existante
                  </div>
                ) : (
                  <div className="max-h-60 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-2">
                    {existingWorkouts.map((workout) => (
                      <button
                        key={workout.id}
                        onClick={() => setSelectedWorkoutId(workout.id)}
                        className={`
                          w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors
                          ${selectedWorkoutId === workout.id
                            ? 'bg-primary-100 border-2 border-primary-500'
                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                          }
                        `}
                      >
                        <div>
                          <p className="font-medium text-gray-900">{workout.name}</p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(workout.date), 'd MMM yyyy', { locale: fr })}
                          </p>
                        </div>
                        {selectedWorkoutId === workout.id && (
                          <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="newName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nouveau nom <span className="text-gray-400">(optionnel)</span>
                </label>
                <input
                  id="newName"
                  type="text"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  placeholder="Garder le nom original si vide"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setMode('select')}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Retour
                </button>
                <button
                  onClick={handleDuplicate}
                  disabled={loading || !selectedWorkoutId}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    'Dupliquer'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
