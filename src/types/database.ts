export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      workouts: {
        Row: {
          id: string
          user_id: string
          name: string
          date: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          date: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          date?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workouts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      exercises: {
        Row: {
          id: string
          workout_id: string
          name: string
          position: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workout_id: string
          name: string
          position?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workout_id?: string
          name?: string
          position?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercises_workout_id_fkey"
            columns: ["workout_id"]
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          }
        ]
      }
      sets: {
        Row: {
          id: string
          exercise_id: string
          position: number
          reps: number
          weight: number
          rest_time: number | null
          is_dropset: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          exercise_id: string
          position?: number
          reps: number
          weight: number
          rest_time?: number | null
          is_dropset?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          exercise_id?: string
          position?: number
          reps?: number
          weight?: number
          rest_time?: number | null
          is_dropset?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sets_exercise_id_fkey"
            columns: ["exercise_id"]
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          }
        ]
      }
      dropset_entries: {
        Row: {
          id: string
          set_id: string
          position: number
          reps: number
          weight: number
          created_at: string
        }
        Insert: {
          id?: string
          set_id: string
          position?: number
          reps: number
          weight: number
          created_at?: string
        }
        Update: {
          id?: string
          set_id?: string
          position?: number
          reps?: number
          weight?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dropset_entries_set_id_fkey"
            columns: ["set_id"]
            referencedRelation: "sets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      duplicate_workout: {
        Args: {
          source_workout_id: string
          new_date: string
          new_name?: string | null
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Types utilitaires
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Workout = Database['public']['Tables']['workouts']['Row']
export type WorkoutInsert = Database['public']['Tables']['workouts']['Insert']
export type WorkoutUpdate = Database['public']['Tables']['workouts']['Update']

export type Exercise = Database['public']['Tables']['exercises']['Row']
export type ExerciseInsert = Database['public']['Tables']['exercises']['Insert']
export type ExerciseUpdate = Database['public']['Tables']['exercises']['Update']

export type Set = Database['public']['Tables']['sets']['Row']
export type SetInsert = Database['public']['Tables']['sets']['Insert']
export type SetUpdate = Database['public']['Tables']['sets']['Update']

export type DropsetEntry = Database['public']['Tables']['dropset_entries']['Row']
export type DropsetEntryInsert = Database['public']['Tables']['dropset_entries']['Insert']
export type DropsetEntryUpdate = Database['public']['Tables']['dropset_entries']['Update']

// Types avec relations
export interface SetWithDropsets extends Set {
  dropset_entries: DropsetEntry[]
}

export interface ExerciseWithSets extends Exercise {
  sets: SetWithDropsets[]
}

export interface WorkoutWithExercises extends Workout {
  exercises: ExerciseWithSets[]
}
