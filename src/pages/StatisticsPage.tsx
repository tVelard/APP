import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Dumbbell,
  TrendingUp,
  Target,
  Calendar,
  ChevronRight,
  Trophy,
  Clock,
  AlertTriangle,
  Zap,
  Timer,
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Header } from '@/components/layout/Header'
import {
  useStatistics,
  GlobalStats,
  ExerciseStats,
  ExerciseDetail,
} from '@/hooks/useStatistics'

type ViewMode = 'global' | 'exercise'
type PeriodFilter = 30 | 90 | 365

export function StatisticsPage() {
  const navigate = useNavigate()
  const { getGlobalStats, getExercisesList, getExerciseDetail, loading } =
    useStatistics()

  const [viewMode, setViewMode] = useState<ViewMode>('global')
  const [period, setPeriod] = useState<PeriodFilter>(30)
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null)
  const [exercisesList, setExercisesList] = useState<ExerciseStats[]>([])
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null)
  const [exerciseDetail, setExerciseDetail] = useState<ExerciseDetail | null>(null)

  useEffect(() => {
    loadGlobalStats()
    loadExercisesList()
  }, [period])

  useEffect(() => {
    if (selectedExercise) {
      loadExerciseDetail(selectedExercise)
    }
  }, [selectedExercise])

  const loadGlobalStats = async () => {
    const { data } = await getGlobalStats(period)
    if (data) {
      setGlobalStats(data)
    }
  }

  const loadExercisesList = async () => {
    const { data } = await getExercisesList()
    if (data) {
      setExercisesList(data)
    }
  }

  const loadExerciseDetail = async (exerciseName: string) => {
    const { data } = await getExerciseDetail(exerciseName)
    if (data) {
      setExerciseDetail(data)
    }
  }

  const handleExerciseSelect = (exerciseName: string) => {
    setSelectedExercise(exerciseName)
    setViewMode('exercise')
  }

  const handleBackToGlobal = () => {
    setViewMode('global')
    setSelectedExercise(null)
    setExerciseDetail(null)
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}k`
    return volume.toString()
  }

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'd MMM', { locale: fr })
  }

  const formatRestTime = (seconds: number) => {
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return secs > 0 ? `${mins}m${secs}s` : `${mins}min`
    }
    return `${seconds}s`
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back button */}
        <button
          onClick={() =>
            viewMode === 'exercise' ? handleBackToGlobal() : navigate('/')
          }
          className="flex items-center gap-2 text-gray-400 hover:text-gray-200 mb-4 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>
            {viewMode === 'exercise'
              ? 'Retour aux statistiques'
              : 'Retour au tableau de bord'}
          </span>
        </button>

        {viewMode === 'global' ? (
          <>
            {/* Header avec filtre de période */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-100">
                  Statistiques
                </h1>
                <p className="text-gray-400 mt-1">
                  Analysez votre progression
                </p>
              </div>

              <div className="flex items-center bg-gray-800 rounded-lg p-1 border border-gray-700">
                {([30, 90, 365] as PeriodFilter[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      period === p
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {p === 30 ? '30j' : p === 90 ? '3 mois' : '1 an'}
                  </button>
                ))}
              </div>
            </div>

            {loading && !globalStats ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Vue globale - Cartes de stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-primary-600/20 rounded-lg">
                        <Dumbbell className="h-5 w-5 text-primary-400" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-100">
                      {globalStats?.totalWorkouts || 0}
                    </p>
                    <p className="text-sm text-gray-400">Séances</p>
                  </div>

                  <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-green-600/20 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-green-400" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-100">
                      {formatVolume(globalStats?.totalVolume || 0)}
                      <span className="text-sm font-normal text-gray-400 ml-1">
                        kg
                      </span>
                    </p>
                    <p className="text-sm text-gray-400">Volume total</p>
                  </div>

                  <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-orange-600/20 rounded-lg">
                        <Target className="h-5 w-5 text-orange-400" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-100">
                      {globalStats?.totalSets || 0}
                    </p>
                    <p className="text-sm text-gray-400">Séries</p>
                  </div>

                  <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-purple-600/20 rounded-lg">
                        <Calendar className="h-5 w-5 text-purple-400" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-100">
                      {globalStats?.averageWorkoutsPerWeek || 0}
                    </p>
                    <p className="text-sm text-gray-400">Séances/semaine</p>
                  </div>
                </div>

                {/* Exercice le plus travaillé */}
                {globalStats?.mostWorkedExercise && (
                  <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 mb-8">
                    <h3 className="text-lg font-semibold text-gray-100 mb-3">
                      Exercice favori
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-primary-600/20 rounded-xl flex items-center justify-center">
                        <Trophy className="h-7 w-7 text-primary-400" />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-gray-100 capitalize">
                          {globalStats.mostWorkedExercise.name}
                        </p>
                        <p className="text-sm text-gray-400">
                          Réalisé {globalStats.mostWorkedExercise.count} fois
                          sur la période
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Liste des exercices */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                  <div className="p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-100">
                      Progression par exercice
                    </h3>
                    <p className="text-sm text-gray-400">
                      Cliquez sur un exercice pour voir les détails
                    </p>
                  </div>

                  <div className="divide-y divide-gray-700">
                    {exercisesList.length > 0 ? (
                      exercisesList.map((exercise) => (
                        <button
                          key={exercise.name}
                          onClick={() => handleExerciseSelect(exercise.name)}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-700/50 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                              <Dumbbell className="h-5 w-5 text-gray-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-100 capitalize">
                                {exercise.name}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-gray-400">
                                <span>{exercise.totalSets} séries</span>
                                <span>•</span>
                                <span>Max: {exercise.maxWeight}kg</span>
                                {exercise.estimated1RM && (
                                  <>
                                    <span>•</span>
                                    <span className="text-primary-400">
                                      1RM: ~{exercise.estimated1RM}kg
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-500" />
                        </button>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-gray-500">
                          Aucun exercice enregistré
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          /* Vue détaillée d'un exercice */
          <>
            {loading && !exerciseDetail ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : exerciseDetail ? (
              <>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-100 capitalize">
                    {exerciseDetail.name}
                  </h1>
                  <p className="text-gray-400 mt-1">
                    Historique et progression
                  </p>
                </div>

                {/* Cartes principales : 1RM, Meilleure perf, Dernière séance */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {/* 1RM Estimé */}
                  {exerciseDetail.estimated1RM && (
                    <div className="bg-gradient-to-br from-primary-900/50 to-primary-800/30 rounded-xl border border-primary-700/50 p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-primary-600/30 rounded-lg">
                          <Zap className="h-5 w-5 text-primary-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-100">
                            1RM Estimé
                          </h3>
                          <p className="text-xs text-gray-400">Formule d'Epley</p>
                        </div>
                      </div>
                      <p className="text-4xl font-bold text-primary-400">
                        {exerciseDetail.estimated1RM}
                        <span className="text-xl font-normal text-primary-400/70 ml-1">
                          kg
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        1RM = poids × (1 + reps/30)
                      </p>
                    </div>
                  )}

                  {/* Meilleure performance */}
                  {exerciseDetail.bestPerformance && (
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-yellow-600/20 rounded-lg">
                          <Trophy className="h-5 w-5 text-yellow-400" />
                        </div>
                        <h3 className="font-semibold text-gray-100">
                          Meilleure série
                        </h3>
                      </div>
                      <p className="text-3xl font-bold text-gray-100">
                        {exerciseDetail.bestPerformance.weight}
                        <span className="text-lg font-normal text-gray-400 ml-1">
                          kg
                        </span>
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {exerciseDetail.bestPerformance.reps} reps •{' '}
                        {format(
                          new Date(exerciseDetail.bestPerformance.date),
                          'd MMM yyyy',
                          { locale: fr }
                        )}
                      </p>
                    </div>
                  )}

                  {/* Temps de repos moyen */}
                  {exerciseDetail.avgRestTime && (
                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-cyan-600/20 rounded-lg">
                          <Timer className="h-5 w-5 text-cyan-400" />
                        </div>
                        <h3 className="font-semibold text-gray-100">
                          Repos moyen
                        </h3>
                      </div>
                      <p className="text-3xl font-bold text-gray-100">
                        {formatRestTime(exerciseDetail.avgRestTime)}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Sur toutes les séances
                      </p>
                    </div>
                  )}
                </div>

                {/* Dernière séance */}
                {exerciseDetail.lastSession && (
                  <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-600/20 rounded-lg">
                        <Clock className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-100">
                          Dernière séance
                        </h3>
                        <p className="text-xs text-gray-500">
                          {exerciseDetail.lastSession.workoutName} •{' '}
                          {format(
                            new Date(exerciseDetail.lastSession.date),
                            'd MMMM yyyy',
                            { locale: fr }
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {exerciseDetail.lastSession.sets.map((set, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-2 bg-gray-700 rounded-lg"
                        >
                          <span className="text-sm font-medium text-gray-200">
                            {set.reps}×{set.weight}kg
                          </span>
                          {set.restTime && (
                            <span className="text-xs text-gray-500 ml-2">
                              ({formatRestTime(set.restTime)})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Graphique progression 1RM */}
                {exerciseDetail.progressData.length > 1 && (
                  <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 mb-6">
                    <h3 className="font-semibold text-gray-100 mb-4">
                      Progression du 1RM estimé
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={exerciseDetail.progressData.filter(d => d.estimated1RM)}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#374151"
                          />
                          <XAxis
                            dataKey="date"
                            tickFormatter={formatDate}
                            stroke="#9ca3af"
                            fontSize={12}
                          />
                          <YAxis
                            stroke="#9ca3af"
                            fontSize={12}
                            tickFormatter={(v) => `${v}kg`}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1f2937',
                              border: '1px solid #374151',
                              borderRadius: '8px',
                            }}
                            labelStyle={{ color: '#9ca3af' }}
                            formatter={(value) => [`${value} kg`, '1RM estimé']}
                            labelFormatter={(label) =>
                              format(new Date(label), 'd MMMM yyyy', {
                                locale: fr,
                              })
                            }
                          />
                          <Line
                            type="monotone"
                            dataKey="estimated1RM"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Graphique poids max */}
                {exerciseDetail.progressData.length > 1 && (
                  <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 mb-6">
                    <h3 className="font-semibold text-gray-100 mb-4">
                      Progression du poids max
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={exerciseDetail.progressData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#374151"
                          />
                          <XAxis
                            dataKey="date"
                            tickFormatter={formatDate}
                            stroke="#9ca3af"
                            fontSize={12}
                          />
                          <YAxis
                            stroke="#9ca3af"
                            fontSize={12}
                            tickFormatter={(v) => `${v}kg`}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1f2937',
                              border: '1px solid #374151',
                              borderRadius: '8px',
                            }}
                            labelStyle={{ color: '#9ca3af' }}
                            formatter={(value) => [`${value} kg`, 'Poids max']}
                            labelFormatter={(label) =>
                              format(new Date(label), 'd MMMM yyyy', {
                                locale: fr,
                              })
                            }
                          />
                          <Line
                            type="monotone"
                            dataKey="maxWeight"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={{ fill: '#10b981', strokeWidth: 2 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Graphique volume par séance */}
                {exerciseDetail.progressData.length > 1 && (
                  <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 mb-6">
                    <h3 className="font-semibold text-gray-100 mb-4">
                      Volume par séance
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={exerciseDetail.progressData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#374151"
                          />
                          <XAxis
                            dataKey="date"
                            tickFormatter={formatDate}
                            stroke="#9ca3af"
                            fontSize={12}
                          />
                          <YAxis
                            stroke="#9ca3af"
                            fontSize={12}
                            tickFormatter={(v) => formatVolume(v)}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1f2937',
                              border: '1px solid #374151',
                              borderRadius: '8px',
                            }}
                            labelStyle={{ color: '#9ca3af' }}
                            formatter={(value) => [
                              `${Number(value).toLocaleString()} kg`,
                              'Volume',
                            ]}
                            labelFormatter={(label) =>
                              format(new Date(label), 'd MMMM yyyy', {
                                locale: fr,
                              })
                            }
                          />
                          <Bar
                            dataKey="volume"
                            fill="#f59e0b"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Section Temps de Repos */}
                {exerciseDetail.hasRestTimeData && (
                  <>
                    <div className="border-t border-gray-700 pt-6 mb-6">
                      <div className="flex items-start gap-3 mb-4">
                        <Timer className="h-6 w-6 text-cyan-400 mt-0.5" />
                        <div>
                          <h2 className="text-xl font-bold text-gray-100">
                            Analyse du temps de repos
                          </h2>
                          <p className="text-sm text-gray-400">
                            Statistiques basées sur vos données de récupération
                          </p>
                        </div>
                      </div>

                      {/* Disclaimer */}
                      <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-amber-200 font-medium">
                              Avertissement sur la fiabilité des données
                            </p>
                            <p className="text-xs text-amber-300/80 mt-1">
                              Ces statistiques ne sont pertinentes que si vous renseignez
                              systématiquement vos temps de repos. Des données incomplètes
                              ou irrégulières peuvent fausser les analyses. Pour des résultats
                              fiables, soyez assidu dans l'enregistrement de vos temps de récupération.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Évolution du temps de repos */}
                    {exerciseDetail.restTimeEvolution.length > 1 && (
                      <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 mb-6">
                        <h3 className="font-semibold text-gray-100 mb-4">
                          Évolution du temps de repos moyen
                        </h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={exerciseDetail.restTimeEvolution}>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#374151"
                              />
                              <XAxis
                                dataKey="date"
                                tickFormatter={formatDate}
                                stroke="#9ca3af"
                                fontSize={12}
                              />
                              <YAxis
                                stroke="#9ca3af"
                                fontSize={12}
                                tickFormatter={(v) => formatRestTime(v)}
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: '#1f2937',
                                  border: '1px solid #374151',
                                  borderRadius: '8px',
                                }}
                                labelStyle={{ color: '#9ca3af' }}
                                formatter={(value, name) => [
                                  formatRestTime(Number(value)),
                                  name === 'avgRestTime' ? 'Repos moyen' : 'Charge moyenne',
                                ]}
                                labelFormatter={(label) =>
                                  format(new Date(label), 'd MMMM yyyy', {
                                    locale: fr,
                                  })
                                }
                              />
                              <Line
                                type="monotone"
                                dataKey="avgRestTime"
                                stroke="#06b6d4"
                                strokeWidth={2}
                                dot={{ fill: '#06b6d4', strokeWidth: 2 }}
                                activeDot={{ r: 6 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}

                    {/* Corrélation charge / temps de repos */}
                    {exerciseDetail.restTimeCorrelation.length > 2 && (
                      <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 mb-6">
                        <h3 className="font-semibold text-gray-100 mb-2">
                          Corrélation charge / temps de repos
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                          Temps de repos moyen en fonction de la charge utilisée
                        </p>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={exerciseDetail.restTimeCorrelation}>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#374151"
                              />
                              <XAxis
                                dataKey="weight"
                                stroke="#9ca3af"
                                fontSize={12}
                                tickFormatter={(v) => `${v}kg`}
                              />
                              <YAxis
                                stroke="#9ca3af"
                                fontSize={12}
                                tickFormatter={(v) => formatRestTime(v)}
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: '#1f2937',
                                  border: '1px solid #374151',
                                  borderRadius: '8px',
                                }}
                                labelStyle={{ color: '#9ca3af' }}
                                formatter={(value) => [
                                  formatRestTime(Number(value)),
                                  'Repos moyen',
                                ]}
                                labelFormatter={(label) => `Charge: ${label}kg`}
                              />
                              <Bar dataKey="avgRestTime" radius={[4, 4, 0, 0]}>
                                {exerciseDetail.restTimeCorrelation.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={
                                      entry.avgRestTime < 90
                                        ? '#10b981'
                                        : entry.avgRestTime < 150
                                        ? '#f59e0b'
                                        : '#ef4444'
                                    }
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex items-center justify-center gap-6 mt-4 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded" />
                            <span className="text-gray-400">&lt; 1m30</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-amber-500 rounded" />
                            <span className="text-gray-400">1m30 - 2m30</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded" />
                            <span className="text-gray-400">&gt; 2m30</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Message si pas de données de temps de repos */}
                {!exerciseDetail.hasRestTimeData && exerciseDetail.avgRestTime === null && (
                  <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-6">
                    <div className="flex items-start gap-3">
                      <Timer className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-gray-300">
                          Pas de données de temps de repos
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Renseignez vos temps de repos lors de vos séances pour
                          accéder à des statistiques avancées sur votre récupération.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {exerciseDetail.progressData.length <= 1 && (
                  <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
                    <p className="text-gray-400">
                      Pas assez de données pour afficher les graphiques.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Continuez à vous entraîner pour voir votre progression !
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-400">Exercice non trouvé</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
