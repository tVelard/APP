import { useState } from 'react'
import { Edit2, Trash2, Plus, ChevronDown, ChevronUp, Save, X, Loader2 } from 'lucide-react'
import { useExercises } from '@/hooks/useExercises'
import { SetRow } from '@/components/exercise/SetRow'
import { AddSetModal } from '@/components/exercise/AddSetModal'
import type { ExerciseWithSets, SetWithDropsets } from '@/types/database'

interface ExerciseCardProps {
  exercise: ExerciseWithSets
  exerciseNumber: number
  onUpdate: () => void
  onDelete: () => void
}

export function ExerciseCard({ exercise, exerciseNumber, onUpdate, onDelete }: ExerciseCardProps) {
  const { updateExercise, deleteExercise, loading } = useExercises()

  const [isExpanded, setIsExpanded] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(exercise.name)
  const [showAddSet, setShowAddSet] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSaveName = async () => {
    if (!editedName.trim()) return

    const { error } = await updateExercise(exercise.id, { name: editedName.trim() })
    if (!error) {
      setIsEditing(false)
      onUpdate()
    }
  }

  const handleDelete = async () => {
    const { error } = await deleteExercise(exercise.id)
    if (!error) {
      setShowDeleteConfirm(false)
      onDelete()
    }
  }

  const handleSetAdded = () => {
    setShowAddSet(false)
    onUpdate()
  }

  // Calculate summary
  const totalSets = exercise.sets?.length || 0
  const totalVolume = exercise.sets?.reduce((acc, set) => {
    const mainVolume = set.reps * set.weight
    const dropsetVolume = set.dropset_entries?.reduce(
      (dAcc, d) => dAcc + d.reps * d.weight,
      0
    ) || 0
    return acc + mainVolume + dropsetVolume
  }, 0) || 0

  return (
    <div className="border border-gray-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center gap-3 p-4 bg-gray-750 bg-gray-700/50 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-medium text-sm">
          {exerciseNumber}
        </div>

        {isEditing ? (
          <div className="flex-1 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
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
              <Save className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                setIsEditing(false)
                setEditedName(exercise.name)
              }}
              className="p-2 text-gray-400 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1">
              <h3 className="font-medium text-gray-100">{exercise.name}</h3>
              <p className="text-sm text-gray-400">
                {totalSets} série{totalSets > 1 ? 's' : ''} • {totalVolume.toFixed(0)} kg volume
              </p>
            </div>

            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-400 hover:bg-gray-600 rounded-lg transition-colors"
                title="Modifier"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-red-400 hover:bg-red-900/50 rounded-lg transition-colors"
                title="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </>
        )}
      </div>

      {/* Sets List */}
      {isExpanded && (
        <div className="p-4 space-y-2 bg-gray-800">
          {/* Header */}
          {(exercise.sets?.length || 0) > 0 && (
            <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 px-2 mb-2">
              <div className="col-span-1">#</div>
              <div className="col-span-3 text-center">Reps</div>
              <div className="col-span-3 text-center">Poids</div>
              <div className="col-span-3 text-center">Repos</div>
              <div className="col-span-2"></div>
            </div>
          )}

          {exercise.sets?.map((set: SetWithDropsets, index: number) => (
            <SetRow
              key={set.id}
              set={set}
              setNumber={index + 1}
              onUpdate={onUpdate}
              onDelete={onUpdate}
            />
          ))}

          {/* Add Set Button */}
          <button
            onClick={() => setShowAddSet(true)}
            className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-primary-500 hover:text-primary-400 hover:bg-primary-900/20 transition-colors text-sm"
          >
            <Plus className="h-4 w-4" />
            Ajouter une série
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-100 mb-2">
              Supprimer l'exercice ?
            </h3>
            <p className="text-gray-400 mb-6">
              Toutes les séries de cet exercice seront supprimées.
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

      {/* Add Set Modal */}
      {showAddSet && (
        <AddSetModal
          exerciseId={exercise.id}
          position={exercise.sets?.length || 0}
          onClose={() => setShowAddSet(false)}
          onSetAdded={handleSetAdded}
        />
      )}
    </div>
  )
}
