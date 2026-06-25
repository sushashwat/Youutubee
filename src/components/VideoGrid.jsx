import { videos } from '../data/videos'
import VideoCard from './VideoCard'

/**
 * VideoGrid Component
 * --------------------
 * Responsive grid of VideoCard components shown on the home page.
 * Filters the full mock videos list down to the selected category.
 *
 * Props:
 *  - activeCategory (string): currently selected filter ("All" = no filtering)
 */
function VideoGrid({ activeCategory }) {
  const filteredVideos =
    activeCategory === 'All'
      ? videos
      : videos.filter((video) => video.category === activeCategory)

  // Edge case: selected category has no videos (can happen once users
  // start uploading their own videos via the Channel page later).
  if (filteredVideos.length === 0) {
    return (
      <p className="text-yt-text-secondary text-sm py-8 text-center">
        No videos found in this category.
      </p>
    )
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredVideos.map((video) => (
        <VideoCard key={video.videoId} video={video} />
      ))}
    </div>
  )
}

export default VideoGrid