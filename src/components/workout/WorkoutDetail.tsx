import { useState, useEffect } from 'react'
import { ArrowLeft, Edit2, Trash2, Plus, Loader2, Save, X } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useWorkouts } from '@/hooks/useWorkouts'
import { ExerciseCard } from '@/components/exercise/ExerciseCard'
import { AddExerciseModal } from '@/components/exercise/AddExerciseModal'
import type { Workout, WorkoutWithExercises, ExerciseWithSets } from '@/types/database'

interface WorkoutDetailProps {
  workout: Workout
  onBack: () => void
  onDelete: () => void
}

export function WorkoutDetail({ workout, onBack, onDelete }: WorkoutDetailProps) {
  const { getWorkoutWithDetails, updateWorkout, deleteWorkout, loading } = useWorkouts()

  const [workoutData, setWorkoutData] = useState<WorkoutWithExercises | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(workout.name)
  const [showAddExercise, setShowAddExercise] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    loadWorkoutData()
  }, [workout.id])

  const loadWorkoutData = async () => {
    setLoadingData(true)
    const { data } = await getWorkoutWithDetails(workout.id)
    if (data) {
      setWorkoutData(data)
    }
    setLoadingData(false)
  }

  const handleSaveName = async () => {
    if (!editedName.trim()) return

    const { error } = await updateWorkout(workout.id, { name: editedName.trim() })
    if (!error) {
      setIsEditing(false)
      if (workoutData) {
        setWorkoutData({ ...workoutData, name: editedName.trim() })
      }
    }
  }

  const handleDelete = async () => {
    const { error } = await deleteWorkout(workout.id)
    if (!error) {
      onDelete()
    }
  }

  const handleExerciseAdded = () => {
    setShowAddExercise(false)
    loadWorkoutData()
  }

  const handleExerciseUpdated = () => {
    loadWorkoutData()
  }

  const handleExerciseDeleted = () => {
    loadWorkoutData()
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </button>

          {isEditing ? (
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                autoFocus
              />
              <button
                onClick={handleSaveName}
                disabled={loading}
                className="p-2 text-green-400 hover:bg-green-900/50 rounded-lg transition-colors"
              >
                <Save className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setEditedName(workoutData?.name || workout.name)
                }}
                className="p-2 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-100">
                  {workoutData?.name || workout.name}
                </h2>
                <p className="text-sm text-gray-400">
                  {format(new Date(workout.date), 'EEEE d MMMM yyyy', { locale: fr })}
                </p>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors"
                title="Modifier le nom"
              >
                <Edit2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-red-400 hover:bg-red-900/50 rounded-lg transition-colors"
                title="Supprimer la séance"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Exercises List */}
      <div className="p-4 space-y-4">
        {workoutData?.exercises && workoutData.exercises.length > 0 ? (
          workoutData.exercises.map((exercise: ExerciseWithSets, index: number) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              exerciseNumber={index + 1}
              onUpdate={handleExerciseUpdated}
              onDelete={handleExerciseDeleted}
            />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-4">Aucun exercice dans cette séance</p>
          </div>
        )}

        {/* Add Exercise Button */}
        <button
          onClick={() => setShowAddExercise(true)}
          className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-600 rounded-xl text-gray-400 hover:border-primary-500 hover:text-primary-400 hover:bg-primary-900/20 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Ajouter un exercice
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-100 mb-2">
              Supprimer la séance ?
            </h3>
            <p className="text-gray-400 mb-6">
              Cette action est irréversible. Tous les exercices et séries seront supprimés.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Supprimer'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Exercise Modal */}
      {showAddExercise && workoutData && (
        <AddExerciseModal
          workoutId={workoutData.id}
          position={workoutData.exercises?.length || 0}
          onClose={() => setShowAddExercise(false)}
          onExerciseAdded={handleExerciseAdded}
        />
      )}
    </div>
  )
}
