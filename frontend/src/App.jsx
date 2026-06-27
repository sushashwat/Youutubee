import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import VideoPlayer from './pages/VideoPlayer'
import ChannelPage from './pages/ChannelPage'
import CreateChannel from './pages/CreateChannel'
import Login from './pages/Login'
import Signup from './pages/Signup'

/**
 * App Component
 * --------------
 * Defines all routes. Routes nested under Layout share the Header + Sidebar shell. /login and /signup are standalone (no shell).
 */
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/video/:videoId" element={<VideoPlayer />} />
        <Route path="/channel/:channelId" element={<ChannelPage />} />
        <Route path ="/create-channel" element={<CreateChannel/>} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}

export default App