import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { useExercises } from '@/hooks/useExercises'

interface AddExerciseModalProps {
  workoutId: string
  position: number
  onClose: () => void
  onExerciseAdded: () => void
}

// Liste d'exercices courants pour suggestions
const COMMON_EXERCISES = [
  // Poitrine
  'Développé couché',
  'Développé incliné',
  'Développé décliné',
  'Écarté couché',
  'Dips',
  'Push-ups',
  // Dos
  'Tractions',
  'Rowing barre',
  'Rowing haltère',
  'Tirage vertical',
  'Tirage horizontal',
  'Soulevé de terre',
  // Épaules
  'Développé militaire',
  'Élévations latérales',
  'Élévations frontales',
  'Oiseau',
  'Shrugs',
  // Bras
  'Curl biceps',
  'Curl marteau',
  'Curl concentré',
  'Extensions triceps',
  'Dips triceps',
  'Skull crushers',
  // Jambes
  'Squat',
  'Presse à cuisses',
  'Leg extension',
  'Leg curl',
  'Fentes',
  'Hip thrust',
  'Mollets debout',
  'Mollets assis',
  // Abdos
  'Crunch',
  'Planche',
  'Relevé de jambes',
  'Russian twist',
]

export function AddExerciseModal({
  workoutId,
  position,
  onClose,
  onExerciseAdded,
}: AddExerciseModalProps) {
  const { createExercise, loading } = useExercises()

  const [exerciseName, setExerciseName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filteredSuggestions = exerciseName
    ? COMMON_EXERCISES.filter((e) =>
        e.toLowerCase().includes(exerciseName.toLowerCase())
      ).slice(0, 5)
    : []

  const handleSubmit = async () => {
    if (!exerciseName.trim()) {
      setError("Veuillez entrer un nom d'exercice")
      return
    }

    const { error: createError } = await createExercise({
      workout_id: workoutId,
      name: exerciseName.trim(),
      position,
      notes: null,
    })

    if (createError) {
      setError(createError.message)
      return
    }

    onExerciseAdded()
  }

  const handleSelectSuggestion = (name: string) => {
    setExerciseName(name)
    setShowSuggestions(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-gray-100">
            Ajouter un exercice
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="relative">
            <label
              htmlFor="exerciseName"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Nom de l'exercice
            </label>
            <input
              id="exerciseName"
              type="text"
              value={exerciseName}
              onChange={(e) => {
                setExerciseName(e.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              placeholder="Ex: Développé couché, Squat..."
              autoFocus
              autoComplete="off"
            />

            {/* Suggestions dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg overflow-hidden">
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-600 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick suggestions */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Suggestions rapides</p>
            <div className="flex flex-wrap gap-2">
              {['Squat', 'Développé couché', 'Soulevé de terre', 'Tractions'].map(
                (name) => (
                  <button
                    key={name}
                    onClick={() => setExerciseName(name)}
                    className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 transition-colors"
                  >
                    {name}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
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
              'Ajouter'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
