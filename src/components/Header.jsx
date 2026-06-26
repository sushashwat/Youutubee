import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Menu, Search, Mic, Bell, Video, User, LogOut } from 'lucide-react'
import { logout } from '../redux/slices/authSlice'

/**
 * Header Component
 * ------------------
 * Top navigation bar, shown on every "main app" page (via Layout).
 *
 * Right section now reads auth state from Redux:
 *  - isAuthenticated = false -> shows "Sign in" link (to /login)
 *  - isAuthenticated = true  -> shows username + avatar + sign-out button
 *
 * Props:
 *  - onToggleSidebar (function): called when hamburger icon is clicked.
 */
function Header({ onToggleSidebar }) {
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const channels = useSelector((state) => state.channels.items)

  // Check whether the logged-in user already owns a channel.
  // (Will be used later to decide where the Create button navigates.)
  const ownChannel = isAuthenticated ? channels.find((c) => c.owner === user.userId) : null

  return (
    <header
      className="fixed top-0 left-0 right-0 h-14 bg-yt-white border-b border-yt-border
                 flex items-center justify-between px-4 z-50"
    >
      {/* ----------- LEFT SECTION: Hamburger + Logo ----------- */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-full hover:bg-yt-hover-bg"
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-1 cursor-pointer">
          <span className="bg-yt-red text-yt-white rounded px-1 text-xs font-bold leading-5">
            ▶
          </span>
          <span className="text-xl font-bold tracking-tight">YouTube</span>
        </div>
      </div>

      {/* Center: Search bar (UI only for now) */}
      <div className="hidden sm:flex items-center flex-1 max-w-xl mx-8">
        <input
          type="text"
          placeholder="Search"
          className="w-full border border-yt-border rounded-l-full px-4 py-2
                     outline-none focus:border-blue-500"
        />
        <button className="px-5 py-2 bg-yt-hover-bg border border-l-0 border-yt-border rounded-r-full">
          <Search size={20} />
        </button>
        <button className="ml-2 hidden md:flex p-2 rounded-full bg-yt-hover-bg">
          <Mic size={18} />
        </button>
      </div>

      {/* ----------- RIGHT SECTION: Actions + Auth ----------- */}
      <div className="flex items-center gap-3">
        {isAuthenticated && (
          <Link
            to={ownChannel ? `/channel/${ownChannel.channelId}` : '/create-channel'}
            className="hidden sm:block p-2 rounded-full hover:bg-yt-hover-bg"
            aria-label={ownChannel ? 'Your channel' : 'Create channel'}
          >
            <Video size={22} />
          </Link>
        )}
        <button className="hidden sm:block p-2 rounded-full hover:bg-yt-hover-bg" aria-label="Notifications">
          <Bell size={22} />
        </button>

        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            {/* Avatar placeholder - first letter of username (no real profile images yet) */}
            <div className="w-8 h-8 rounded-full bg-yt-red text-yt-white flex items-center justify-center text-sm font-medium">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium hidden sm:inline">{user.username}</span>
            <button
              onClick={() => dispatch(logout())}
              className="p-2 rounded-full hover:bg-yt-hover-bg"
              aria-label="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 border border-yt-border rounded-full
                       px-3 py-1.5 text-blue-600 hover:bg-blue-50"
          >
            <User size={18} />
            <span className="text-sm font-medium">Sign in</span>
          </Link>
        )}
      </div>
    </header>
  )
}

export default Header