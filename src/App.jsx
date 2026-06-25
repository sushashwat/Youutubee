import { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'

function App() {
  // Sidebar open/closed state - lifted here so both Header's hamburger
  // button and Sidebar's render mode can share the same state.
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="bg-yt-bg min-h-screen">
      <Header onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main content shifts right based on current sidebar width */}
      <main
        className={`pt-14 p-4 transition-all duration-200
                    ${isSidebarOpen ? 'ml-60' : 'ml-[72px]'}`}
      >
        <p>Video Grid aur Filters next steps mein aayenge.</p>
      </main>
    </div>
  )
}

export default App