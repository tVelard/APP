import { useState, useEffect } from 'react'
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
  // Ouvrir automatiquement si c'est un dropset (avec ou sans entrées)
  const [isExpanded, setIsExpanded] = useState(set.is_dropset)
  const [localDropsetEntries, setLocalDropsetEntries] = useState(set.dropset_entries || [])

  // Mettre à jour les entrées locales quand les props changent, mais garder l'état d'expansion
  useEffect(() => {
    setLocalDropsetEntries(set.dropset_entries || [])
    setIsDropset(set.is_dropset)
  }, [set.dropset_entries, set.is_dropset])


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
      // Créer automatiquement la première entrée dropset
      await createDropsetEntry({
        set_id: set.id,
        position: 0,
        reps: set.reps,
        weight: set.weight * 0.8, // -20% par défaut
      })
      onUpdate()
    }
  }

  const handleAddDropsetEntry = async () => {
    const position = localDropsetEntries.length
    const lastEntry = localDropsetEntries[position - 1]

    await createDropsetEntry({
      set_id: set.id,
      position,
      reps: lastEntry?.reps || set.reps,
      weight: lastEntry ? lastEntry.weight * 0.8 : set.weight * 0.8, // -20% par défaut
    })
    onUpdate()
  }

  return (
    <div className="bg-gray-700 rounded-lg overflow-hidden">
      {/* Main Row */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-2">
        {/* Set Number - Hidden on mobile, visible on larger screens */}
        <div className="hidden sm:flex items-center gap-1 w-8 flex-shrink-0">
          {isDropset && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-0.5 text-gray-400 hover:text-gray-200"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          )}
          <span className="text-sm font-medium text-gray-300">{setNumber}</span>
        </div>

        {/* Dropset expand button on mobile only */}
        {isDropset && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="sm:hidden p-0.5 text-gray-400 hover:text-gray-200 flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        )}

        {/* Reps */}
        <div className="flex-1 min-w-0">
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            onBlur={() => handleUpdate('reps', reps)}
            className="w-full px-1.5 sm:px-2 py-1.5 text-center text-sm bg-gray-600 border border-gray-500 rounded-lg text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            min="0"
            placeholder="Reps"
          />
        </div>

        {/* Weight */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              onBlur={() => handleUpdate('weight', weight)}
              className="w-full px-1.5 sm:px-2 py-1.5 text-center text-sm bg-gray-600 border border-gray-500 rounded-lg text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none pr-6 sm:pr-7"
              min="0"
              step="0.5"
              placeholder="Poids"
            />
            <span className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">kg</span>
          </div>
        </div>

        {/* Rest Time */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <input
              type="number"
              value={restTime}
              onChange={(e) => setRestTime(e.target.value)}
              onBlur={() => handleUpdate('rest_time', restTime)}
              className="w-full px-1.5 sm:px-2 py-1.5 text-center text-sm bg-gray-600 border border-gray-500 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none pr-4 sm:pr-5"
              placeholder="-"
              min="0"
            />
            <span className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">s</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
          <button
            onClick={handleToggleDropset}
            className={`px-1.5 sm:px-2 py-1 text-xs font-medium rounded transition-colors ${
              isDropset
                ? 'bg-orange-900/50 text-orange-400 border border-orange-700'
                : 'bg-gray-600 text-gray-400 hover:bg-orange-900/30 hover:text-orange-400'
            }`}
            title="Dropset"
          >
            DS
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="p-1 sm:p-1.5 text-red-400 hover:bg-red-900/50 rounded transition-colors"
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
          <div className="ml-4 pl-4 border-l-2 border-orange-600 space-y-1">
            {localDropsetEntries.map((entry: DropsetEntryType, index: number) => (
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
              className="w-full flex items-center justify-center gap-1 py-2 text-xs text-orange-400 hover:bg-orange-900/30 rounded-lg transition-colors"
            >
              <Plus className="h-3 w-3" />
              Ajouter un dropset
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
