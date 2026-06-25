import {Link} from 'react-router-dom'
import { channels } from '../data/channels'
import { formatViews, formatTimeAgo } from '../utils/formatters'

/**
 * VideoCard Component
 * --------------------
 * Single video thumbnail card shown in the Video Grid (home page).
 * 
 * Props:
 *  - video (object): one video object from src/data/videos.js
 * 
 * Wrapped in a <link> so clicking the card navigates to that video's player page (route:/video/:videoId)
 */
function VideoCard({ video }) {
  // Look up the channel this video belongs to, to display its name.
  const channel = channels.find((c) => c.channelId === video.channelId)

  return (
     <Link to={`/video/${video.videoId}`} className="cursor-pointer group block">
      {/* Thumbnail */}
      <div className="relative rounded-xl overflow-hidden aspect-video bg-yt-hover-bg">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>

      {/* Title + channel + views - mirrors YouTube's text layout below the thumbnail */}
      <div className="mt-3">
        <h3 className="text-sm font-medium text-yt-black line-clamp-2">
          {video.title}
        </h3>
        <p className="text-xs text-yt-text-secondary mt-1">
          {channel?.channelName ?? 'Unknown channel'}
        </p>
        <p className="text-xs text-yt-text-secondary">
          {formatViews(video.views)} • {formatTimeAgo(video.uploadDate)}
        </p>
      </div>
    </Link>
  )
}

export default VideoCard