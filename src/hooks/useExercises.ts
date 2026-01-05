import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { ExerciseInsert, ExerciseUpdate, SetInsert, SetUpdate, DropsetEntryInsert, DropsetEntryUpdate } from '@/types/database'

export function useExercises() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Créer un exercice
  const createExercise = useCallback(async (exercise: ExerciseInsert) => {
    setLoading(true)
    setError(null)

    const { data, error: insertError } = await supabase
      .from('exercises')
      .insert(exercise)
      .select()
      .single()

    setLoading(false)

    if (insertError) {
      setError(insertError.message)
      return { data: null, error: insertError }
    }

    return { data, error: null }
  }, [])

  // Mettre à jour un exercice
  const updateExercise = useCallback(async (id: string, updates: ExerciseUpdate) => {
    setLoading(true)
    setError(null)

    const { data, error: updateError } = await supabase
      .from('exercises')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    setLoading(false)

    if (updateError) {
      setError(updateError.message)
      return { data: null, error: updateError }
    }

    return { data, error: null }
  }, [])

  // Supprimer un exercice
  const deleteExercise = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    const { error: deleteError } = await supabase
      .from('exercises')
      .delete()
      .eq('id', id)

    setLoading(false)

    if (deleteError) {
      setError(deleteError.message)
      return { error: deleteError }
    }

    return { error: null }
  }, [])

  // Réordonner les exercices
  const reorderExercises = useCallback(async (exercises: { id: string; position: number }[]) => {
    setLoading(true)
    setError(null)

    const promises = exercises.map(({ id, position }) =>
      supabase.from('exercises').update({ position } as ExerciseUpdate).eq('id', id)
    )

    const results = await Promise.all(promises)
    const hasError = results.some(r => r.error)

    setLoading(false)

    if (hasError) {
      setError('Erreur lors du réordonnement')
      return { error: 'Erreur lors du réordonnement' }
    }

    return { error: null }
  }, [])

  return {
    loading,
    error,
    createExercise,
    updateExercise,
    deleteExercise,
    reorderExercises,
  }
}

export function useSets() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Créer un set
  const createSet = useCallback(async (set: SetInsert) => {
    setLoading(true)
    setError(null)

    const { data, error: insertError } = await supabase
      .from('sets')
      .insert(set)
      .select()
      .single()

    setLoading(false)

    if (insertError) {
      setError(insertError.message)
      return { data: null, error: insertError }
    }

    return { data, error: null }
  }, [])

  // Mettre à jour un set
  const updateSet = useCallback(async (id: string, updates: SetUpdate) => {
    setLoading(true)
    setError(null)

    const { data, error: updateError } = await supabase
      .from('sets')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    setLoading(false)

    if (updateError) {
      setError(updateError.message)
      return { data: null, error: updateError }
    }

    return { data, error: null }
  }, [])

  // Supprimer un set
  const deleteSet = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    const { error: deleteError } = await supabase
      .from('sets')
      .delete()
      .eq('id', id)

    setLoading(false)

    if (deleteError) {
      setError(deleteError.message)
      return { error: deleteError }
    }

    return { error: null }
  }, [])

  // Créer plusieurs sets d'un coup
  const createMultipleSets = useCallback(async (sets: SetInsert[]) => {
    setLoading(true)
    setError(null)

    const { data, error: insertError } = await supabase
      .from('sets')
      .insert(sets)
      .select()

    setLoading(false)

    if (insertError) {
      setError(insertError.message)
      return { data: null, error: insertError }
    }

    return { data, error: null }
  }, [])

  return {
    loading,
    error,
    createSet,
    updateSet,
    deleteSet,
    createMultipleSets,
  }
}

export function useDropsets() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Créer une entrée dropset
  const createDropsetEntry = useCallback(async (entry: DropsetEntryInsert) => {
    setLoading(true)
    setError(null)

    const { data, error: insertError } = await supabase
      .from('dropset_entries')
      .insert(entry)
      .select()
      .single()

    setLoading(false)

    if (insertError) {
      setError(insertError.message)
      return { data: null, error: insertError }
    }

    return { data, error: null }
  }, [])

  // Mettre à jour une entrée dropset
  const updateDropsetEntry = useCallback(async (id: string, updates: DropsetEntryUpdate) => {
    setLoading(true)
    setError(null)

    const { data, error: updateError } = await supabase
      .from('dropset_entries')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    setLoading(false)

    if (updateError) {
      setError(updateError.message)
      return { data: null, error: updateError }
    }

    return { data, error: null }
  }, [])

  // Supprimer une entrée dropset
  const deleteDropsetEntry = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    const { error: deleteError } = await supabase
      .from('dropset_entries')
      .delete()
      .eq('id', id)

    setLoading(false)

    if (deleteError) {
      setError(deleteError.message)
      return { error: deleteError }
    }

    return { error: null }
  }, [])

  // Créer plusieurs entrées dropset
  const createMultipleDropsetEntries = useCallback(async (entries: DropsetEntryInsert[]) => {
    setLoading(true)
    setError(null)

    const { data, error: insertError } = await supabase
      .from('dropset_entries')
      .insert(entries)
      .select()

    setLoading(false)

    if (insertError) {
      setError(insertError.message)
      return { data: null, error: insertError }
    }

    return { data, error: null }
  }, [])

  return {
    loading,
    error,
    createDropsetEntry,
    updateDropsetEntry,
    deleteDropsetEntry,
    createMultipleDropsetEntries,
  }
}
