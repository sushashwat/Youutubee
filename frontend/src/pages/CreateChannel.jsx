import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector} from 'react-redux'
import api from '../api/axios'

/**
 * Create Channel Page
 * ---------------------
 * Route: "/create-channel" - only accessible when signed in. 
 * Calls real backend to create the channel 
 */
function CreateChannel() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const [channelName, setChannelName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  if (!isAuthenticated) {
    return (
      <div className="text-center py-16">
        <p className="mb-3">You need to sign in to create a channel.</p>
        <Link to="/login" className="text-blue-600 font-medium">Sign in</Link>
      </div>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!channelName.trim()) return

    try{
      const {data} = await api.post('/channels', {
        channelName: channelName.trim(),
        description: description.trim(),
      })
      navigate(`/channel/${data._id}`)
    } catch(err) {
      setError(err.response?.data?.message || 'Failed to create channel')
    }
  }

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-xl font-semibold mb-6">Create your channel</h1>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="block">
          <span className="text-sm font-medium">Channel name</span>
          <input
            type="text" value={channelName} onChange={(e) => setChannelName(e.target.value)}
            className="mt-1 w-full border border-yt-border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Description</span>
          <textarea
            value={description} onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full border border-yt-border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </label>
        <button type="submit" className="bg-yt-black text-yt-white py-2 rounded-lg text-sm font-medium">
          Create channel
        </button>
      </form>
    </div>
  )
}

export default CreateChannel    