import { useState } from 'react'
import { X, Loader2, Plus, Minus } from 'lucide-react'
import { useSets } from '@/hooks/useExercises'

interface AddSetModalProps {
  exerciseId: string
  position: number
  onClose: () => void
  onSetAdded: () => void
}

export function AddSetModal({
  exerciseId,
  position,
  onClose,
  onSetAdded,
}: AddSetModalProps) {
  const { createSet, createMultipleSets, loading } = useSets()

  const [reps, setReps] = useState('10')
  const [weight, setWeight] = useState('20')
  const [restTime, setRestTime] = useState('')
  const [numberOfSets, setNumberOfSets] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    const repsNum = parseInt(reps) || 0
    const weightNum = parseFloat(weight) || 0
    const restTimeNum = restTime ? parseInt(restTime) : null

    if (repsNum <= 0) {
      setError('Le nombre de répétitions doit être supérieur à 0')
      return
    }

    if (numberOfSets === 1) {
      const { error: createError } = await createSet({
        exercise_id: exerciseId,
        position,
        reps: repsNum,
        weight: weightNum,
        rest_time: restTimeNum,
        is_dropset: false,
      })

      if (createError) {
        setError(createError.message)
        return
      }
    } else {
      // Créer plusieurs sets
      const setsToCreate = Array.from({ length: numberOfSets }, (_, i) => ({
        exercise_id: exerciseId,
        position: position + i,
        reps: repsNum,
        weight: weightNum,
        rest_time: restTimeNum,
        is_dropset: false,
      }))

      const { error: createError } = await createMultipleSets(setsToCreate)

      if (createError) {
        setError(createError.message)
        return
      }
    }

    onSetAdded()
  }

  const incrementSets = () => setNumberOfSets((n) => Math.min(n + 1, 10))
  const decrementSets = () => setNumberOfSets((n) => Math.max(n - 1, 1))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Ajouter des séries
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Number of sets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de séries à ajouter
            </label>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={decrementSets}
                disabled={numberOfSets <= 1}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="h-5 w-5" />
              </button>
              <span className="text-2xl font-semibold w-12 text-center">
                {numberOfSets}
              </span>
              <button
                onClick={incrementSets}
                disabled={numberOfSets >= 10}
                className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Reps */}
          <div>
            <label
              htmlFor="reps"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Répétitions
            </label>
            <input
              id="reps"
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              min="1"
            />
          </div>

          {/* Weight */}
          <div>
            <label
              htmlFor="weight"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Poids (kg)
            </label>
            <input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              min="0"
              step="0.5"
            />
          </div>

          {/* Rest Time */}
          <div>
            <label
              htmlFor="restTime"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Temps de repos (secondes){' '}
              <span className="text-gray-400 font-normal">optionnel</span>
            </label>
            <input
              id="restTime"
              type="number"
              value={restTime}
              onChange={(e) => setRestTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              min="0"
              placeholder="Ex: 90"
            />
          </div>

          {/* Quick rest time buttons */}
          <div className="flex gap-2">
            {[60, 90, 120, 180].map((time) => (
              <button
                key={time}
                onClick={() => setRestTime(time.toString())}
                className={`flex-1 py-1.5 text-sm rounded-lg transition-colors ${
                  restTime === time.toString()
                    ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                }`}
              >
                {time >= 60 ? `${time / 60}min` : `${time}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              `Ajouter ${numberOfSets > 1 ? `${numberOfSets} séries` : '1 série'}`
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
