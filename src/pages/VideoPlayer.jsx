import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { videos } from '../data/videos'
import { channels } from '../data/channels'
import { formatViews, formatTimeAgo } from '../utils/formatters'
import CommentSection from '../components/CommentSection'

/**
 * VideoPlayer Page
 * -----------------
 * Route: "/video/:videoId"
 * Shows: video player, title/description, channel name, like/dislike
 * buttons, and the full comment section.
 *
 * NOTE: likes/dislikes/comments are local state for now (mock data).
 * Backend step will replace these with real API calls.
 */
function VideoPlayer() {
  const { videoId } = useParams()
  const video = videos.find((v) => v.videoId === videoId)

  // Tracks what *this* user clicked: 'like' | 'dislike' | null.
  // Needed so clicking Like again "undoes" it, and switching from
  // Like to Dislike correctly removes the previous reaction.
  const [likes, setLikes] = useState(video?.likes ?? 0)
  const [dislikes, setDislikes] = useState(video?.dislikes ?? 0)
  const [userReaction, setUserReaction] = useState(null)

  if (!video) {
    return <p className="text-yt-text-secondary">Video not found.</p>
  }

  const channel = channels.find((c) => c.channelId === video.channelId)

  function handleLike() {
    if (userReaction === 'like') {
      setLikes((prev) => prev - 1)
      setUserReaction(null)
    } else {
      setLikes((prev) => prev + 1)
      if (userReaction === 'dislike') setDislikes((prev) => prev - 1)
      setUserReaction('like')
    }
  }

  function handleDislike() {
    if (userReaction === 'dislike') {
      setDislikes((prev) => prev - 1)
      setUserReaction(null)
    } else {
      setDislikes((prev) => prev + 1)
      if (userReaction === 'like') setLikes((prev) => prev - 1)
      setUserReaction('dislike')
    }
  }

  return (
    <div className="max-w-4xl">
      {/* Video player */}
      <video
        src={video.videoUrl}
        controls
        className="w-full aspect-video rounded-xl bg-yt-black"
      />

      {/* Title */}
      <h1 className="text-lg font-semibold mt-3">{video.title}</h1>

      {/* Channel name + like/dislike row */}
      <div className="flex items-center justify-between mt-2 flex-wrap gap-3">
        <div>
          <p className="font-medium">{channel?.channelName ?? 'Unknown channel'}</p>
          <p className="text-xs text-yt-text-secondary">
            {formatViews(video.views)} • {formatTimeAgo(video.uploadDate)}
          </p>
        </div>

        <div className="flex items-center bg-yt-hover-bg rounded-full">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-l-full border-r border-yt-border
                        ${userReaction === 'like' ? 'text-blue-600' : ''}`}
          >
            <ThumbsUp size={18} />
            <span className="text-sm">{likes}</span>
          </button>
          <button
            onClick={handleDislike}
            className={`flex items-center gap-2 px-4 py-2 rounded-r-full
                        ${userReaction === 'dislike' ? 'text-blue-600' : ''}`}
          >
            <ThumbsDown size={18} />
            <span className="text-sm">{dislikes}</span>
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="bg-yt-hover-bg rounded-xl p-3 mt-3 text-sm whitespace-pre-line">
        {video.description}
      </p>

      {/* Comments - full CRUD handled inside CommentSection */}
      <CommentSection initialComments={video.comments} />
    </div>
  )
}

export default VideoPlayer