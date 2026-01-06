import { Dumbbell } from 'lucide-react'
import { ProfileMenu } from './ProfileMenu'

export function Header() {
  return (
    <header className="bg-gray-800 dark:bg-gray-800 border-b border-gray-700 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-100 dark:text-gray-100">
              TrackTraining
            </span>
          </div>

          {/* Profile Menu */}
          <ProfileMenu />
        </div>
      </div>
    </header>
  )
}
