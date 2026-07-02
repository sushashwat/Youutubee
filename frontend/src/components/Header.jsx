import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Menu, Search, Mic, Bell, Video, User, LogOut, ArrowLeft } from 'lucide-react'
import { logout } from '../redux/slices/authSlice'
import { setSearchTerm } from '../redux/slices/searchSlice'

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
 * 
 * 
 * Mobile behaviour: the search bar is hidden by default to save space;
 * tapping the search icon swaps the entire header row for a full-width
 * search input with a back button (matches the real YouTube app pattern).
 * Desktop (sm and up) always shows the full header with search inline.

 */
function Header({ onToggleSidebar }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const channels = useSelector((state) => state.channels.items)
  const searchTerm = useSelector((state) => state.search.term)
  const myChannel = useSelector((state) => state.channels.myChannel)

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  // Check whether the logged-in user already owns a channel.
  // (Will be used later to decide where the Create button navigates.)
  const ownChannel = isAuthenticated ? channels.find((c) => c.owner === user?._id) : null

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-yt-white border-b border-yt-border z-50">
      {isMobileSearchOpen ? (
        /* ----------- MOBILE SEARCH ROW (replaces whole header) ----------- */
        <div className="flex items-center h-full gap-2 px-2">
          <button
            onClick={() => setIsMobileSearchOpen(false)}
            className="p-2 rounded-full hover:bg-yt-hover-bg shrink-0"
            aria-label="Close search"
          >
            <ArrowLeft size={20} />
          </button>
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            placeholder="Search"
            className="flex-1 border border-yt-border rounded-full px-4 py-2 outline-none focus:border-blue-500 text-sm"
          />
        </div>
      ) : (
        /* ----------- NORMAL HEADER ROW ----------- */
        <div className="flex items-center justify-between h-full px-4">
          {/* LEFT: Hamburger + Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-full hover:bg-yt-hover-bg"
              aria-label="Toggle sidebar"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate('/')}>
              <div className="bg-yt-red rounded px-1.5 py-0.5 flex items-center justify-center">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-black">YouTube</span>
            </div>
          </div>

          {/* CENTER: Search bar - hidden on mobile (icon shown instead, right section) */}
          <div className="hidden sm:flex items-center flex-1 max-w-xl mx-8">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              placeholder="Search"
              className="w-full border border-yt-border rounded-l-full px-4 py-2 outline-none focus:border-blue-500"
            />
            <button className="px-5 py-2 bg-yt-hover-bg border border-l-0 border-yt-border rounded-r-full">
              <Search size={20} />
            </button>
            <button className="ml-2 hidden md:flex p-2 rounded-full bg-yt-hover-bg">
              <Mic size={18} />
            </button>
          </div>

          {/* RIGHT: Actions + Auth */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Mobile-only search trigger */}
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="sm:hidden p-2 rounded-full hover:bg-yt-hover-bg"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {isAuthenticated && (
              <Link
                to={myChannel ? `/channel/${myChannel._id}` : '/create-channel'}
                className="hidden sm:block p-2 rounded-full hover:bg-yt-hover-bg"
                aria-label={myChannel ? 'Your channel' : 'Create channel'}
              >
                <Video size={22} />
              </Link>
            )}
            <button className="hidden sm:block p-2 rounded-full hover:bg-yt-hover-bg" aria-label="Notifications">
              <Bell size={22} />
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
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
                className="flex items-center gap-1 sm:gap-2 border border-yt-border rounded-full
                           px-2 sm:px-3 py-1.5 text-blue-600 hover:bg-blue-50"
              >
                <User size={18} />
                <span className="text-sm font-medium hidden sm:inline">Sign in</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header