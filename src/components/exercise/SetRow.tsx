import { useState } from 'react'
import { Trash2, ChevronDown, ChevronRight, Plus, Loader2 } from 'lucide-react'
import { useSets, useDropsets } from '@/hooks/useExercises'
import { DropsetEntry } from '@/components/exercise/DropsetEntry'
import type { SetWithDropsets, DropsetEntry as DropsetEntryType } from '@/types/database'

interface SetRowProps {
  set: SetWithDropsets
  setNumber: number
  onUpdate: () => void
  onDelete: () => void
}

export function SetRow({ set, setNumber, onUpdate, onDelete }: SetRowProps) {
  const { updateSet, deleteSet, loading } = useSets()
  const { createDropsetEntry } = useDropsets()

  const [reps, setReps] = useState(set.reps.toString())
  const [weight, setWeight] = useState(set.weight.toString())
  const [restTime, setRestTime] = useState(set.rest_time?.toString() || '')
  const [isDropset, setIsDropset] = useState(set.is_dropset)
  const [isExpanded, setIsExpanded] = useState(false)
  

  const handleUpdate = async (field: string, value: string | boolean) => {
    let updates: Record<string, number | boolean | null> = {}

    switch (field) {
      case 'reps':
        updates = { reps: parseInt(value as string) || 0 }
        break
      case 'weight':
        updates = { weight: parseFloat(value as string) || 0 }
        break
      case 'rest_time':
        updates = { rest_time: value ? parseInt(value as string) : null }
        break
      case 'is_dropset':
        updates = { is_dropset: value as boolean }
        break
    }

    const { error } = await updateSet(set.id, updates)
    if (!error) {
      onUpdate()
    }
  }

  const handleDelete = async () => {
    const { error } = await deleteSet(set.id)
    if (!error) {
      onDelete()
    }
  }

  const handleToggleDropset = async () => {
    const newValue = !isDropset
    setIsDropset(newValue)
    await handleUpdate('is_dropset', newValue)
    if (newValue) {
      setIsExpanded(true)
    }
  }

  const handleAddDropsetEntry = async () => {
    const position = set.dropset_entries?.length || 0
    const lastEntry = set.dropset_entries?.[position - 1]

    await createDropsetEntry({
      set_id: set.id,
      position,
      reps: lastEntry?.reps || set.reps,
      weight: lastEntry ? lastEntry.weight * 0.8 : set.weight * 0.8, // -20% par défaut
    })
    onUpdate()
  }

  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden">
      {/* Main Row */}
      <div className="grid grid-cols-12 gap-2 items-center p-2">
        {/* Set Number & Dropset Toggle */}
        <div className="col-span-1 flex items-center gap-1">
          {isDropset && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-0.5 text-gray-400 hover:text-gray-600"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          )}
          <span className="text-sm font-medium text-gray-700">{setNumber}</span>
        </div>

        {/* Reps */}
        <div className="col-span-3">
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            onBlur={() => handleUpdate('reps', reps)}
            className="w-full px-2 py-1.5 text-center text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            min="0"
          />
        </div>

        {/* Weight */}
        <div className="col-span-3">
          <div className="relative">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              onBlur={() => handleUpdate('weight', weight)}
              className="w-full px-2 py-1.5 text-center text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none pr-7"
              min="0"
              step="0.5"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">kg</span>
          </div>
        </div>

        {/* Rest Time */}
        <div className="col-span-3">
          <div className="relative">
            <input
              type="number"
              value={restTime}
              onChange={(e) => setRestTime(e.target.value)}
              onBlur={() => handleUpdate('rest_time', restTime)}
              className="w-full px-2 py-1.5 text-center text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none pr-5"
              placeholder="-"
              min="0"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">s</span>
          </div>
        </div>

        {/* Actions */}
        <div className="col-span-2 flex items-center justify-end gap-1">
          <button
            onClick={handleToggleDropset}
            className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
              isDropset
                ? 'bg-orange-100 text-orange-700'
                : 'bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-600'
            }`}
            title="Dropset"
          >
            DS
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Dropset Entries */}
      {isDropset && isExpanded && (
        <div className="px-2 pb-2 space-y-1">
          <div className="ml-4 pl-4 border-l-2 border-orange-300 space-y-1">
            {set.dropset_entries?.map((entry: DropsetEntryType, index: number) => (
              <DropsetEntry
                key={entry.id}
                entry={entry}
                entryNumber={index + 1}
                onUpdate={onUpdate}
                onDelete={onUpdate}
              />
            ))}

            <button
              onClick={handleAddDropsetEntry}
              className="w-full flex items-center justify-center gap-1 py-2 text-xs text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            >
              <Plus className="h-3 w-3" />
              Ajouter une sous-série
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
