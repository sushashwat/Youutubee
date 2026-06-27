import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { addChannel } from '../redux/slices/channelsSlice'

/**
 * Create Channel Page
 * ---------------------
 * Route: "/create-channel"
 * Per assignment spec: a channel can only be created after signing in.
 */
function CreateChannel() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  const [channelName, setChannelName] = useState('')
  const [description, setDescription] = useState('')

  if (!isAuthenticated) {
    return (
      <div className="text-center py-16">
        <p className="mb-3">You need to sign in to create a channel.</p>
        <Link to="/login" className="text-blue-600 font-medium">Sign in</Link>
      </div>
    )
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!channelName.trim()) return

    const newChannelId = `channel-${Date.now()}`

    dispatch(
      addChannel({
        channelId: newChannelId,
        channelName: channelName.trim(),
        owner: user.userId,
        description: description.trim(),
        channelBanner: `https://placehold.co/1200x200/ff0000/ffffff?text=${encodeURIComponent(channelName)}`,
        subscribers: 0,     
        videos: [],
      })
    )

    navigate(`/channel/${newChannelId}`)
  }

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-xl font-semibold mb-6">Create your channel</h1>
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