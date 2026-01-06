import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthContext } from '@/contexts/AuthContext'

export interface GlobalStats {
  totalWorkouts: number
  totalVolume: number
  totalSets: number
  totalReps: number
  mostWorkedExercise: {
    name: string
    count: number
  } | null
  averageWorkoutsPerWeek: number
  periodDays: number
}

export interface ExerciseStats {
  name: string
  totalSets: number
  totalVolume: number
  maxWeight: number
  lastPerformed: string | null
  estimated1RM: number | null
  avgRestTime: number | null
  restTimeDataCount: number
}

export interface ExerciseProgressData {
  date: string
  maxWeight: number
  volume: number
  workoutName: string
  avgRestTime: number | null
  estimated1RM: number | null
}

export interface RestTimeCorrelation {
  weight: number
  avgRestTime: number
  count: number
}

export interface ExerciseDetail {
  name: string
  progressData: ExerciseProgressData[]
  bestPerformance: {
    weight: number
    reps: number
    date: string
    estimated1RM: number
  } | null
  lastSession: {
    date: string
    workoutName: string
    sets: { reps: number; weight: number; restTime: number | null }[]
  } | null
  estimated1RM: number | null
  avgRestTime: number | null
  restTimeEvolution: { date: string; avgRestTime: number; avgWeight: number }[]
  restTimeCorrelation: RestTimeCorrelation[]
  hasRestTimeData: boolean
}

// Formule d'Epley pour calculer le 1RM estimé
// 1RM = poids × (1 + reps/30)
export function calculate1RM(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0
  if (reps === 1) return weight
  return Math.round(weight * (1 + reps / 30) * 10) / 10
}

export function useStatistics() {
  const { user } = useAuthContext()
  const [loading, setLoading] = useState(false)

  const getGlobalStats = useCallback(async (days: number = 30): Promise<{ data: GlobalStats | null; error: Error | null }> => {
    if (!user) return { data: null, error: new Error('Non authentifié') }

    setLoading(true)

    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      const startDateStr = startDate.toISOString().split('T')[0]

      // Récupérer tous les workouts avec leurs exercices et sets
      const { data: workouts, error: workoutsError } = await supabase
        .from('workouts')
        .select(`
          id,
          name,
          date,
          exercises (
            id,
            name,
            sets (
              id,
              reps,
              weight
            )
          )
        `)
        .eq('user_id', user.id)
        .gte('date', startDateStr)
        .order('date', { ascending: false })

      if (workoutsError) throw workoutsError

      if (!workouts || workouts.length === 0) {
        setLoading(false)
        return {
          data: {
            totalWorkouts: 0,
            totalVolume: 0,
            totalSets: 0,
            totalReps: 0,
            mostWorkedExercise: null,
            averageWorkoutsPerWeek: 0,
            periodDays: days,
          },
          error: null,
        }
      }

      // Calculer les statistiques
      let totalVolume = 0
      let totalSets = 0
      let totalReps = 0
      const exerciseCount: Record<string, number> = {}

      workouts.forEach((workout: any) => {
        workout.exercises?.forEach((exercise: any) => {
          const exerciseName = exercise.name.toLowerCase().trim()
          exerciseCount[exerciseName] = (exerciseCount[exerciseName] || 0) + 1

          exercise.sets?.forEach((set: any) => {
            totalSets++
            totalReps += set.reps || 0
            totalVolume += (set.reps || 0) * (set.weight || 0)
          })
        })
      })

      // Trouver l'exercice le plus travaillé
      let mostWorkedExercise: { name: string; count: number } | null = null
      let maxCount = 0
      Object.entries(exerciseCount).forEach(([name, count]) => {
        if (count > maxCount) {
          maxCount = count
          mostWorkedExercise = { name, count }
        }
      })

      // Calculer la moyenne de séances par semaine
      const weeks = days / 7
      const averageWorkoutsPerWeek = workouts.length / weeks

      setLoading(false)
      return {
        data: {
          totalWorkouts: workouts.length,
          totalVolume: Math.round(totalVolume),
          totalSets,
          totalReps,
          mostWorkedExercise,
          averageWorkoutsPerWeek: Math.round(averageWorkoutsPerWeek * 10) / 10,
          periodDays: days,
        },
        error: null,
      }
    } catch (error) {
      setLoading(false)
      return { data: null, error: error as Error }
    }
  }, [user])

  const getExercisesList = useCallback(async (): Promise<{ data: ExerciseStats[] | null; error: Error | null }> => {
    if (!user) return { data: null, error: new Error('Non authentifié') }

    setLoading(true)

    try {
      const { data: exercises, error: exercisesError } = await supabase
        .from('exercises')
        .select(`
          id,
          name,
          workout_id,
          workouts!inner (
            user_id,
            date
          ),
          sets (
            id,
            reps,
            weight,
            rest_time
          )
        `)
        .eq('workouts.user_id', user.id)

      if (exercisesError) throw exercisesError

      if (!exercises) {
        setLoading(false)
        return { data: [], error: null }
      }

      // Agréger par nom d'exercice
      const exerciseMap: Record<string, ExerciseStats & {
        best1RM: number
        restTimes: number[]
      }> = {}

      exercises.forEach((exercise: any) => {
        const name = exercise.name.toLowerCase().trim()

        if (!exerciseMap[name]) {
          exerciseMap[name] = {
            name: exercise.name,
            totalSets: 0,
            totalVolume: 0,
            maxWeight: 0,
            lastPerformed: null,
            estimated1RM: null,
            avgRestTime: null,
            restTimeDataCount: 0,
            best1RM: 0,
            restTimes: [],
          }
        }

        const stats = exerciseMap[name]
        const workoutDate = exercise.workouts?.date

        if (workoutDate && (!stats.lastPerformed || workoutDate > stats.lastPerformed)) {
          stats.lastPerformed = workoutDate
        }

        exercise.sets?.forEach((set: any) => {
          stats.totalSets++
          stats.totalVolume += (set.reps || 0) * (set.weight || 0)

          if (set.weight > stats.maxWeight) {
            stats.maxWeight = set.weight
          }

          // Calculer le 1RM pour cette série
          const set1RM = calculate1RM(set.weight || 0, set.reps || 0)
          if (set1RM > stats.best1RM) {
            stats.best1RM = set1RM
          }

          // Collecter les temps de repos
          if (set.rest_time && set.rest_time > 0) {
            stats.restTimes.push(set.rest_time)
          }
        })
      })

      // Finaliser les statistiques
      const result = Object.values(exerciseMap).map(({ best1RM, restTimes, ...stats }) => ({
        ...stats,
        estimated1RM: best1RM > 0 ? best1RM : null,
        avgRestTime: restTimes.length > 0
          ? Math.round(restTimes.reduce((a, b) => a + b, 0) / restTimes.length)
          : null,
        restTimeDataCount: restTimes.length,
      })).sort((a, b) => b.totalSets - a.totalSets)

      setLoading(false)
      return { data: result, error: null }
    } catch (error) {
      setLoading(false)
      return { data: null, error: error as Error }
    }
  }, [user])

  const getExerciseDetail = useCallback(async (exerciseName: string): Promise<{ data: ExerciseDetail | null; error: Error | null }> => {
    if (!user) return { data: null, error: new Error('Non authentifié') }

    setLoading(true)

    try {
      const { data: exercises, error: exercisesError } = await supabase
        .from('exercises')
        .select(`
          id,
          name,
          workouts!inner (
            id,
            user_id,
            name,
            date
          ),
          sets (
            id,
            reps,
            weight,
            rest_time,
            position
          )
        `)
        .eq('workouts.user_id', user.id)
        .ilike('name', exerciseName)
        .order('workouts(date)', { ascending: true })

      if (exercisesError) throw exercisesError

      if (!exercises || exercises.length === 0) {
        setLoading(false)
        return { data: null, error: new Error('Exercice non trouvé') }
      }

      // Construire les données de progression
      const progressData: ExerciseProgressData[] = []
      let bestPerformance: ExerciseDetail['bestPerformance'] = null
      let lastSession: ExerciseDetail['lastSession'] = null

      // Pour les statistiques globales
      let globalBest1RM = 0
      const allRestTimes: number[] = []
      const restTimeEvolution: ExerciseDetail['restTimeEvolution'] = []
      const weightRestMap: Record<number, number[]> = {} // Pour la corrélation poids/repos

      exercises.forEach((exercise: any) => {
        const workout = exercise.workouts
        const sets = exercise.sets || []

        if (sets.length === 0) return

        let maxWeight = 0
        let volume = 0
        let session1RM = 0
        const sessionRestTimes: number[] = []
        let sessionTotalWeight = 0
        let sessionWeightCount = 0

        sets.forEach((set: any) => {
          const weight = set.weight || 0
          const reps = set.reps || 0
          const restTime = set.rest_time

          if (weight > maxWeight) {
            maxWeight = weight
          }
          volume += reps * weight

          // Calculer le 1RM pour cette série
          const set1RM = calculate1RM(weight, reps)
          if (set1RM > session1RM) {
            session1RM = set1RM
          }
          if (set1RM > globalBest1RM) {
            globalBest1RM = set1RM
          }

          // Collecter temps de repos
          if (restTime && restTime > 0) {
            sessionRestTimes.push(restTime)
            allRestTimes.push(restTime)

            // Pour la corrélation charge/repos
            const weightBucket = Math.round(weight / 5) * 5 // Arrondir au 5kg près
            if (!weightRestMap[weightBucket]) {
              weightRestMap[weightBucket] = []
            }
            weightRestMap[weightBucket].push(restTime)
          }

          // Pour calculer le poids moyen de la séance
          if (weight > 0) {
            sessionTotalWeight += weight
            sessionWeightCount++
          }

          // Vérifier meilleure performance (basée sur le 1RM estimé)
          if (!bestPerformance || set1RM > bestPerformance.estimated1RM) {
            bestPerformance = {
              weight,
              reps,
              date: workout.date,
              estimated1RM: set1RM,
            }
          }
        })

        // Ajouter données de progression
        const avgSessionRestTime = sessionRestTimes.length > 0
          ? Math.round(sessionRestTimes.reduce((a, b) => a + b, 0) / sessionRestTimes.length)
          : null

        progressData.push({
          date: workout.date,
          maxWeight,
          volume: Math.round(volume),
          workoutName: workout.name,
          avgRestTime: avgSessionRestTime,
          estimated1RM: session1RM > 0 ? session1RM : null,
        })

        // Évolution du temps de repos
        if (avgSessionRestTime !== null) {
          restTimeEvolution.push({
            date: workout.date,
            avgRestTime: avgSessionRestTime,
            avgWeight: sessionWeightCount > 0
              ? Math.round(sessionTotalWeight / sessionWeightCount)
              : 0,
          })
        }

        // Dernière séance
        lastSession = {
          date: workout.date,
          workoutName: workout.name,
          sets: sets
            .sort((a: any, b: any) => a.position - b.position)
            .map((s: any) => ({
              reps: s.reps,
              weight: s.weight,
              restTime: s.rest_time || null,
            })),
        }
      })

      // Calculer la corrélation charge/repos
      const restTimeCorrelation: RestTimeCorrelation[] = Object.entries(weightRestMap)
        .map(([weight, times]) => ({
          weight: parseInt(weight),
          avgRestTime: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
          count: times.length,
        }))
        .filter((item) => item.count >= 2) // Au moins 2 données pour être significatif
        .sort((a, b) => a.weight - b.weight)

      // Moyenne globale du temps de repos
      const avgRestTime = allRestTimes.length > 0
        ? Math.round(allRestTimes.reduce((a, b) => a + b, 0) / allRestTimes.length)
        : null

      setLoading(false)
      return {
        data: {
          name: exercises[0].name,
          progressData,
          bestPerformance,
          lastSession,
          estimated1RM: globalBest1RM > 0 ? globalBest1RM : null,
          avgRestTime,
          restTimeEvolution,
          restTimeCorrelation,
          hasRestTimeData: allRestTimes.length >= 5, // Au moins 5 données pour afficher les stats
        },
        error: null,
      }
    } catch (error) {
      setLoading(false)
      return { data: null, error: error as Error }
    }
  }, [user])

  return {
    loading,
    getGlobalStats,
    getExercisesList,
    getExerciseDetail,
  }
}
