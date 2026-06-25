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
 */
function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="bg-yt-bg min-h-screen">
      <Header onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
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