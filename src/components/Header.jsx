import { Link } from 'react-router-dom'
import { Menu, Search, Mic, Bell, Video, User } from 'lucide-react'

/**
 * Header Component
 * ------------------
 * Top navigation bar of the app, shown on every page (fixed position).
 *
 * Sections:
 *  1. Left  -> Hamburger menu (toggles sidebar) + YouTube logo
 *  2. Center -> Search bar (UI only for now; search logic added in Redux step)
 *  3. Right -> Action icons (create video, notifications) + Sign-in button
 *
 * Props:
 *  - onToggleSidebar (function): called when hamburger icon is clicked.
 *    Will be passed down from a parent layout component once Sidebar is built.
 */
function Header({ onToggleSidebar }) {
  return (
    <header
      className="fixed top-0 left-0 right-0 h-14 bg-yt-white border-b border-yt-border
                 flex items-center justify-between px-4 z-50"
    >
      {/* ----------- LEFT SECTION: Hamburger + Logo ----------- */}
      <div className="flex items-center gap-4">
        {/* Hamburger button - toggles the sidebar open/closed.
            Currently just calls the prop;*/}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-full hover:bg-yt-hover-bg"
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>

        {/* YouTube-style logo (text-based, since we can't use the real logo/IP) */}
        <div className="flex items-center gap-1 cursor-pointer">
          <span className="bg-yt-red text-yt-white rounded px-1 text-xs font-bold leading-5">
            ▶
          </span>
          <span className="text-xl font-bold tracking-tight">YouTube</span>
        </div>
      </div>

         {/* ----------- CENTER SECTION: Search bar ----------- */}

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
        {/* Mic icon - decorative only, no voice search functionality planned */}
        <button className="ml-2 hidden md:flex p-2 rounded-full bg-yt-hover-bg">
          <Mic size={18} />
        </button>
      </div>

      {/* ----------- RIGHT SECTION: Actions + Auth -----------
          "Create video" and "Notifications" icons are placeholders */}
      <div className="flex items-center gap-3">
        <button className="hidden sm:block p-2 rounded-full hover:bg-yt-hover-bg" aria-label="Create">
          <Video size={22} />
        </button>
        <button className="hidden sm:block p-2 rounded-full hover:bg-yt-hover-bg" aria-label="Notifications">
          <Bell size={22} />
        </button>

        {/* Sign-in button:
            - Currently static.
            - In the Auth step, this will become a <Link to="/login"> (React Router)
              and will conditionally render the logged-in user's name + avatar
              instead, once a user is authenticated (Redux auth state). */}
        <Link
        to="/login" className="flex items-center gap-2 border border-yt-border rounded-full
                            px-3 py-1.5 text-blue-600 hover:bg-blue-50">
          <User size={18} />
          <span className="text-sm font-medium">Sign in</span>
        </Link>
      </div>
    </header>
  )
}

export default Header