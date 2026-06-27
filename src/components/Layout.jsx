import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

/**
 * Layout Component
 * ------------------
 * Shared shell (Header + Sidebar) for main app pages (Home, VideoPlayer,
 * ChannelPage). <Outlet /> renders whichever page matches the current
 * route. Login/Signup render outside this layout (no header/sidebar).
 * 
 * Mobile (<sm): Sidebar becomes a slide-in overlay drawer. A dark
 * backdrop appears behind it - tapping the backdrop closes the drawer.
 * Desktop (sm+): unchanged push/collapse behaviour, no backdrop.
 */

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="bg-yt-bg min-h-screen">
      <Header onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
          {/* Mobile-only backdrop - sm:hidden means it never shows on desktop,
          where the sidebar pushes content instead of overlaying it. */}
          {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 top-14 bg-black/50 z-30 sm:hidden"
        />
      )}
      <Sidebar isOpen={isSidebarOpen} />

      <main
        className={`pt-14 p-4 transition-all duration-200
                    ${isSidebarOpen ? 'ml-60' : 'ml-18'}`}
      >
        <Outlet />
      </main>
    </div>
  )
}

export default Layout