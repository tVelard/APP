import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { WorkoutInsert, WorkoutUpdate, WorkoutWithExercises, Exercise, Set, DropsetEntry } from '@/types/database'

export function useWorkouts() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Récupérer toutes les séances d'un mois
  const getWorkoutsByMonth = useCallback(async (year: number, month: number) => {
    setLoading(true)
    setError(null)

    const startDate = new Date(year, month, 1).toISOString().split('T')[0]
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0]

    const { data, error: queryError } = await supabase
      .from('workouts')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })

    setLoading(false)

    if (queryError) {
      setError(queryError.message)
      return { data: null, error: queryError }
    }

    return { data, error: null }
  }, [])

  // Récupérer une séance complète avec exercices, sets et dropsets
  const getWorkoutWithDetails = useCallback(async (workoutId: string) => {
    setLoading(true)
    setError(null)

    const { data, error: queryError } = await supabase
      .from('workouts')
      .select(`
        *,
        exercises (
          *,
          sets (
            *,
            dropset_entries (*)
          )
        )
      `)
      .eq('id', workoutId)
      .single()

    setLoading(false)

    if (queryError) {
      setError(queryError.message)
      return { data: null, error: queryError }
    }

    // Trier les exercices et sets par position
    if (data && data.exercises) {
      const sortedExercises = (data.exercises as (Exercise & { sets: (Set & { dropset_entries: DropsetEntry[] })[] })[])
        .sort((a, b) => a.position - b.position)
        .map((exercise) => ({
          ...exercise,
          sets: exercise.sets
            .sort((a, b) => a.position - b.position)
            .map(set => ({
              ...set,
              dropset_entries: set.dropset_entries.sort((a, b) => a.position - b.position)
            }))
        }))
      
      return { data: { ...data, exercises: sortedExercises } as WorkoutWithExercises, error: null }
    }

    return { data: data as WorkoutWithExercises, error: null }
  }, [])

  // Récupérer les séances par date
  const getWorkoutsByDate = useCallback(async (date: string) => {
    setLoading(true)
    setError(null)

    const { data, error: queryError } = await supabase
      .from('workouts')
      .select('*')
      .eq('date', date)
      .order('created_at', { ascending: true })

    setLoading(false)

    if (queryError) {
      setError(queryError.message)
      return { data: null, error: queryError }
    }

    return { data, error: null }
  }, [])

  // Créer une nouvelle séance
  const createWorkout = useCallback(async (workout: WorkoutInsert) => {
    setLoading(true)
    setError(null)

    const { data, error: insertError } = await supabase
      .from('workouts')
      .insert(workout)
      .select()
      .single()

    setLoading(false)

    if (insertError) {
      setError(insertError.message)
      return { data: null, error: insertError }
    }

    return { data, error: null }
  }, [])

  // Mettre à jour une séance
  const updateWorkout = useCallback(async (id: string, updates: WorkoutUpdate) => {
    setLoading(true)
    setError(null)

    const { data, error: updateError } = await supabase
      .from('workouts')
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

  // Supprimer une séance
  const deleteWorkout = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    const { error: deleteError } = await supabase
      .from('workouts')
      .delete()
      .eq('id', id)

    setLoading(false)

    if (deleteError) {
      setError(deleteError.message)
      return { error: deleteError }
    }

    return { error: null }
  }, [])

  // Dupliquer une séance existante
  const duplicateWorkout = useCallback(async (sourceWorkoutId: string, newDate: string, newName?: string) => {
    setLoading(true)
    setError(null)

    const { data, error: rpcError } = await supabase
      .rpc('duplicate_workout', {
        source_workout_id: sourceWorkoutId,
        new_date: newDate,
        new_name: newName ?? null,
      })

    setLoading(false)

    if (rpcError) {
      setError(rpcError.message)
      return { data: null, error: rpcError }
    }

    return { data, error: null }
  }, [])

  // Récupérer toutes les séances (pour la sélection lors de la duplication)
  const getAllWorkouts = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data, error: queryError } = await supabase
      .from('workouts')
      .select('*')
      .order('date', { ascending: false })
      .limit(50)

    setLoading(false)

    if (queryError) {
      setError(queryError.message)
      return { data: null, error: queryError }
    }

    return { data, error: null }
  }, [])

  return {
    loading,
    error,
    getWorkoutsByMonth,
    getWorkoutsByDate,
    getWorkoutWithDetails,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    duplicateWorkout,
    getAllWorkouts,
  }
}
