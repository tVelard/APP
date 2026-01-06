import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { useDropsets } from '@/hooks/useExercises'
import type { DropsetEntry as DropsetEntryType } from '@/types/database'

interface DropsetEntryProps {
  entry: DropsetEntryType
  entryNumber: number
  onUpdate: () => void
  onDelete: () => void
}

export function DropsetEntry({ entry, entryNumber, onUpdate, onDelete }: DropsetEntryProps) {
  const { updateDropsetEntry, deleteDropsetEntry, loading } = useDropsets()

  const [reps, setReps] = useState(entry.reps.toString())
  const [weight, setWeight] = useState(entry.weight.toString())

  const handleUpdate = async (field: 'reps' | 'weight', value: string) => {
    const updates =
      field === 'reps'
        ? { reps: parseInt(value) || 0 }
        : { weight: parseFloat(value) || 0 }

    const { error } = await updateDropsetEntry(entry.id, updates)
    if (!error) {
      onUpdate()
    }
  }

  const handleDelete = async () => {
    const { error } = await deleteDropsetEntry(entry.id)
    if (!error) {
      onDelete()
    }
  }

  return (
    <div className="flex items-center gap-2 py-1.5 px-2 bg-orange-900/30 rounded-lg">
      <span className="text-xs font-medium text-orange-400 w-6">
        {entryNumber}.
      </span>

      <div className="flex-1 flex items-center gap-2">
        <div className="flex-1">
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            onBlur={() => handleUpdate('reps', reps)}
            className="w-full px-2 py-1 text-center text-xs bg-gray-700 border border-orange-700/50 rounded text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            min="0"
            placeholder="Reps"
          />
        </div>

        <span className="text-xs text-gray-500">×</span>

        <div className="flex-1 relative">
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            onBlur={() => handleUpdate('weight', weight)}
            className="w-full px-2 py-1 text-center text-xs bg-gray-700 border border-orange-700/50 rounded text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none pr-6"
            min="0"
            step="0.5"
            placeholder="Poids"
          />
          <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-xs text-gray-500">kg</span>
        </div>
      </div>

      <button
        onClick={handleDelete}
        disabled={loading}
        className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900/50 rounded transition-colors"
      >
        {loading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Trash2 className="h-3 w-3" />
        )}
      </button>
    </div>
  )
}
