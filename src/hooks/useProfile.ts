import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Profile, ProfileUpdate } from '@/types/database'

export function useProfile() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getProfile = useCallback(async (userId: string) => {
    setLoading(true)
    setError(null)

    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    setLoading(false)

    if (fetchError) {
      setError(fetchError.message)
      return { data: null, error: fetchError }
    }

    return { data: data as Profile, error: null }
  }, [])

  const updateProfile = useCallback(async (userId: string, updates: ProfileUpdate) => {
    setLoading(true)
    setError(null)

    const { data, error: updateError } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()

    setLoading(false)

    if (updateError) {
      setError(updateError.message)
      return { data: null, error: updateError }
    }

    return { data: data as Profile, error: null }
  }, [])

  const uploadAvatar = useCallback(async (userId: string, file: File) => {
    setLoading(true)
    setError(null)

    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      setLoading(false)
      setError(uploadError.message)
      return { url: null, error: uploadError }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    const avatarUrl = urlData.publicUrl

    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
      .eq('id', userId)

    setLoading(false)

    if (updateError) {
      setError(updateError.message)
      return { url: null, error: updateError }
    }

    return { url: avatarUrl, error: null }
  }, [])

  return {
    loading,
    error,
    getProfile,
    updateProfile,
    uploadAvatar,
  }
}
