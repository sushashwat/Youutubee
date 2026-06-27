import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Pencil, Trash2 } from 'lucide-react'
import { deleteVideo, updateVideo, addVideo } from '../redux/slices/videosSlice'
import { categories } from '../data/categories'
import { formatViews, formatTimeAgo } from '../utils/formatters'

/**
 * Channel Page
 * -------------
 * Route: "/channel/:channelId"
 *
 * Shows channel banner/info + grid of its videos. If the logged-in user
 * owns this channel, shows Edit/Delete on each video and an upload form.
 */
function ChannelPage() {
  const { channelId } = useParams()
  const dispatch = useDispatch()

  const channels = useSelector((state) => state.channels.items)
  const allVideos = useSelector((state) => state.videos.items)
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  const channel = channels.find((c) => c.channelId === channelId)
  const channelVideos = allVideos.filter((v) => v.channelId === channelId)

  // Owner check - only the channel's creator sees edit/delete/upload controls.
  const isOwner = isAuthenticated && channel?.owner === user?.userId

  const [editingVideoId, setEditingVideoId] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  const [showUploadForm, setShowUploadForm] = useState(false)
  const [newVideo, setNewVideo] = useState({
    title: '',
    thumbnailUrl: '',
    videoUrl: '',
    description: '',
    category: 'Education',
  })

  if (!channel) {
    return <p className="text-yt-text-secondary">Channel not found.</p>
  }

  function startEdit(video) {
    setEditingVideoId(video.videoId)
    setEditTitle(video.title)
  }

  function saveEdit(videoId) {
    const trimmed = editTitle.trim()
    if (!trimmed) return
    dispatch(updateVideo({ videoId, title: trimmed }))
    setEditingVideoId(null)
  }

  function handleDelete(videoId) {
    dispatch(deleteVideo(videoId))
  }

  function handleUploadChange(e) {
    setNewVideo((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleUploadSubmit(e) {
    e.preventDefault()
    if (!newVideo.title.trim() || !newVideo.thumbnailUrl.trim()) return

    dispatch(
      addVideo({
        videoId: `video-${Date.now()}`,
        title: newVideo.title.trim(),
        thumbnailUrl: newVideo.thumbnailUrl.trim(),
        videoUrl: newVideo.videoUrl.trim() || 'https://www.w3schools.com/html/mov_bbb.mp4',
        description: newVideo.description.trim(),
        channelId: channel.channelId,
        uploader: user.userId,
        category: newVideo.category,
        views: 0,
        likes: 0,
        dislikes: 0,
        uploadDate: new Date().toISOString().slice(0, 10),
        comments: [],
      })
    )

    setNewVideo({ title: '', thumbnailUrl: '', videoUrl: '', description: '', category: 'Education' })
    setShowUploadForm(false)
  }

  return (
    <div>
      <img
        src={channel.channelBanner}
        alt={`${channel.channelName} banner`}
        className="w-full h-32 sm:h-44 object-cover rounded-xl bg-yt-hover-bg"
      />

      <div className="flex items-center justify-between flex-wrap gap-3 mt-4">
        <div>
          <h1 className="text-xl font-semibold">{channel.channelName}</h1>
          <p className="text-sm text-yt-text-secondary">
            {channel.subscribers.toLocaleString()} subscribers • {channelVideos.length} videos
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

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {channelVideos.map((video) => (
          <div key={video.videoId}>
            <Link to={`/video/${video.videoId}`} className="block">
              <div className="aspect-video rounded-xl overflow-hidden bg-yt-hover-bg">
                <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
              </div>
            </Link>

            <div className="mt-2">
              {editingVideoId === video.videoId ? (
                <div className="flex gap-2">
                  <input
                    type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 border-b border-yt-border outline-none text-sm pb-1" autoFocus
                  />
                  <button onClick={() => saveEdit(video.videoId)} className="text-xs font-medium text-blue-600">
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

            {isOwner && editingVideoId !== video.videoId && (
              <div className="flex gap-3 mt-1">
                <button
                  onClick={() => startEdit(video)}
                  className="flex items-center gap-1 text-xs text-yt-text-secondary hover:text-yt-black"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(video.videoId)}
                  className="flex items-center gap-1 text-xs text-yt-text-secondary hover:text-yt-black"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        ))}

        {channelVideos.length === 0 && (
          <p className="text-yt-text-secondary text-sm">No videos uploaded yet.</p>
        )}
      </div>
    </div>
  )
}

export default ChannelPage