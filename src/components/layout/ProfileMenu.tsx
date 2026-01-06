import { useState, useRef, useEffect } from 'react'
import { LogOut, Settings, Moon, Sun } from 'lucide-react'
import { useAuthContext } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useProfile } from '@/hooks/useProfile'
import { ProfileSettingsModal } from './ProfileSettingsModal'
import type { Profile } from '@/types/database'

export function ProfileMenu() {
  const { user, signOut } = useAuthContext()
  const { theme, toggleTheme } = useTheme()
  const { getProfile } = useProfile()

  const [isOpen, setIsOpen] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadProfile = async () => {
    if (!user) return
    const { data } = await getProfile(user.id)
    if (data) {
      setProfile(data)
    }
  }

  const handleSignOut = async () => {
    setIsOpen(false)
    await signOut()
  }

  const handleSettingsClick = () => {
    setIsOpen(false)
    setShowSettings(true)
  }

  const handleProfileUpdated = (updatedProfile: Profile) => {
    setProfile(updatedProfile)
  }

  const getInitials = () => {
    if (profile?.display_name) {
      return profile.display_name.slice(0, 2).toUpperCase()
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase()
    }
    return 'U'
  }

  const getDisplayName = () => {
    return profile?.display_name || user?.email || 'Utilisateur'
  }

  return (
    <>
      <div className="relative" ref={menuRef}>
        {/* Avatar Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-600 hover:border-primary-500 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary-600 flex items-center justify-center text-white font-medium text-sm">
              {getInitials()}
            </div>
          )}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden z-50">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary-600 flex items-center justify-center text-white font-medium text-sm">
                      {getInitials()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-100 truncate">
                    {getDisplayName()}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? (
                    <Moon className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Sun className="h-4 w-4 text-yellow-400" />
                  )}
                  <span>Mode {theme === 'dark' ? 'sombre' : 'clair'}</span>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${
                  theme === 'dark' ? 'bg-primary-600' : 'bg-gray-600'
                }`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    theme === 'dark' ? 'left-5' : 'left-0.5'
                  }`} />
                </div>
              </button>

              {/* Settings */}
              <button
                onClick={handleSettingsClick}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
              >
                <Settings className="h-4 w-4 text-gray-400" />
                <span>Paramètres du profil</span>
              </button>
            </div>

            {/* Sign Out */}
            <div className="border-t border-gray-700 py-2">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <ProfileSettingsModal
          profile={profile}
          onClose={() => setShowSettings(false)}
          onProfileUpdated={handleProfileUpdated}
        />
      )}
    </>
  )
}
