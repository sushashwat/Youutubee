import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ImageOff, Pencil, Trash2 } from 'lucide-react'
import { createVideo, updateVideo, deleteVideo } from '../redux/slices/videosSlice'
import { categories } from '../data/categories'
import { formatViews, formatTimeAgo } from '../utils/formatters'
import api from '../api/axios'

/**
 * Channel Page
 * -------------
 * Route: "/channel/:channelId"
 * Fetches channel data from real backend. Owner sees upload/edit/delete.
 */

function ChannelPage() {
  const { channelId } = useParams()
  const dispatch = useDispatch()

  const {user, isAuthenticated} = useSelector((state)=> state.auth)

  const[channel, setChannel] = useState(null)
  const[channelVideos, setChannelVideos] = useState([])
  const[loading, setLoading] = useState(true)

  const [editingVideoId, setEditingVideoId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [newVideo, setNewVideo] = useState({
    title: '', thumbnailUrl: '', videoUrl: '', description: '', category: 'Education',
  })

  // Fetch channel + its videos from backend on mount
  useEffect(() => {
    async function fetchChannel() {
      try {
        setLoading(true)
        const { data } = await api.get(`/channels/${channelId}`)
        setChannel(data)
        setChannelVideos(data.videos ?? [])
      } catch (err) {
        console.error('Failed to fetch channel:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchChannel()
  }, [channelId])

  // Owner check - MongoDB _id comparison
  const isOwner = isAuthenticated && channel?.owner?.toString() === user?._id

  if (loading) {
    return <p className="text-yt-text-secondary">Loading channel...</p>
  }

  if (!channel) {
    return <p className="text-yt-text-secondary">Channel not found.</p>
  }

  function startEdit(video) {
    setEditingVideoId(video._id)
    setEditTitle(video.title)
  }

  async function saveEdit(videoId) {
    const trimmed = editTitle.trim()
    if (!trimmed) return
    const result = await dispatch(updateVideo({ videoId, title: trimmed }))
    if (updateVideo.fulfilled.match(result)) {
      setChannelVideos((prev) =>
        prev.map((v) => (v._id === videoId ? { ...v, title: trimmed } : v))
      )
    }
    setEditingVideoId(null)
  }

  async function handleDelete(videoId) {
    const result = await dispatch(deleteVideo(videoId))
    if (deleteVideo.fulfilled.match(result)) {
      setChannelVideos((prev) => prev.filter((v) => v._id !== videoId))
    }
  }

  function handleUploadChange(e) {
    setNewVideo((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleUploadSubmit(e) {
    e.preventDefault()
    if (!newVideo.title.trim() || !newVideo.thumbnailUrl.trim()) return

    const result = await dispatch(
      createVideo({
        title: newVideo.title.trim(),
        thumbnailUrl: newVideo.thumbnailUrl.trim(),
        videoUrl: newVideo.videoUrl.trim() || 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: newVideo.description.trim(),
        category: newVideo.category,
        channelId: channel._id,
      })
    )

    if (createVideo.fulfilled.match(result)) {
      setChannelVideos((prev) => [result.payload, ...prev])
      setNewVideo({ title: '', thumbnailUrl: '', videoUrl: '', description: '', category: 'Education' })
      setShowUploadForm(false)
    }
  }

  return (
    <div>
       {/* Channel banner */}
      <img
        src={channel.channelBanner || `https://placehold.co/1200x200/ff0000/ffffff?text=${encodeURIComponent(channel.channelName)}`}
        alt={`${channel.channelName} banner`}
        className="w-full h-32 sm:h-44 object-cover rounded-xl bg-yt-hover-bg"
      />
          {/* channel info */}
      <div className="flex items-center justify-between flex-wrap gap-3 mt-4">
        <div>
          <h1 className="text-xl font-semibold">{channel.channelName}</h1>
          <p className="text-sm text-yt-text-secondary">
            {channel.subscribers?.toLocaleString()} subscribers • {channelVideos.length} videos
          </p>
          <p className="text-sm mt-1">{channel.description}</p>
        </div>

        {isOwner && (
          <button
            onClick={() => setShowUploadForm((prev) => !prev)}
            className="bg-yt-black text-yt-white text-sm font-medium px-4 py-2 rounded-full"
          >
            {showUploadForm ? 'Cancel' : 'Upload video'}
          </button>
        )}
      </div>
           {/* Upload form - only visible to channel owner */}
      {isOwner && showUploadForm && (
        <form
          onSubmit={handleUploadSubmit}
          className="border border-yt-border rounded-xl p-4 mt-4 flex flex-col gap-3 max-w-md"
        >
          <input
            type="text" name="title" placeholder="Title"
            value={newVideo.title} onChange={handleUploadChange}
            className="border border-yt-border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
          <input
            type="text" name="thumbnailUrl" placeholder="Thumbnail URL"
            value={newVideo.thumbnailUrl} onChange={handleUploadChange}
            className="border border-yt-border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
          <input
            type="text" name="videoUrl" placeholder="Video URL (optional - sample used if blank)"
            value={newVideo.videoUrl} onChange={handleUploadChange}
            className="border border-yt-border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
          <textarea
            name="description" placeholder="Description"
            value={newVideo.description} onChange={handleUploadChange}
            className="border border-yt-border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
          <select
            name="category" value={newVideo.category} onChange={handleUploadChange}
            className="border border-yt-border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            {categories.filter((c) => c !== 'All').map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button type="submit" className="bg-yt-red text-yt-white text-sm font-medium py-2 rounded-lg">
            Publish
          </button>
        </form>
      )}

            {/* Videos grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6">
         {channelVideos.length === 0 && (
          <p className="text-yt-text-secondary text-sm">No videos uploaded yet.</p>
        )}

        {channelVideos.map((video) => (
          <div key={video._id}>
            <Link to={`/video/${video._id}`} className="block">
              <div className="aspect-video rounded-xl overflow-hidden bg-yt-hover-bg">
                <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
              </div>
            </Link>

            <div className="mt-2">
              {editingVideoId === video._id ? (
                <div className="flex gap-2">
                  <input
                    type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 border-b border-yt-border outline-none text-sm pb-1" autoFocus
                  />
                  <button onClick={() => saveEdit(video._id)} className="text-xs font-medium text-blue-600">
                    Save
                  </button>
                </div>
              ) : (
                <h3 className="text-sm font-medium line-clamp-2">{video.title}</h3>
              )}
              <p className="text-xs text-yt-text-secondary mt-1">
                {formatViews(video.views)} • {formatTimeAgo(video.uploadDate)}
              </p>
            </div>

            {isOwner && editingVideoId !== video._id && (
              <div className="flex gap-3 mt-1">
                <button
                  onClick={() => startEdit(video)}
                  className="flex items-center gap-1 text-xs text-yt-text-secondary hover:text-yt-black"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(video._id)}
                  className="flex items-center gap-1 text-xs text-yt-text-secondary hover:text-yt-black"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChannelPage