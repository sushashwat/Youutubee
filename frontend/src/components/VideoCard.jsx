import {Link} from 'react-router-dom'
import { formatViews, formatTimeAgo } from '../utils/formatters'

/**
 * VideoCard Component
 * --------------------
 * Renders a single video thumbnail card. Data now comes from the real
 * backend (MongoDB _id instead of mock videoId, channel is populated
 * object instead of a separate lookup).
 */


function VideoCard({ video }) {
  return (
     <Link to={`/video/${video._id}`} className="cursor-pointer group block">
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
        {/* channel is a populated object from backend, not a separate lookup */}
        <p className="text-xs text-yt-text-secondary mt-1">
          {video.channel?.channelName ?? 'Unknown channel'}
        </p>
        <p className="text-xs text-yt-text-secondary">
          {formatViews(video.views)} • {formatTimeAgo(video.createdAt)}
        </p>
      </div>
    </Link>
  )
}

export default VideoCard