import { useSelector } from 'react-redux'
import VideoCard from './VideoCard'

/**
 * VideoGrid Component
 * --------------------
 * Filters videos by BOTH the selected category AND the search term
 * (case-insensitive match against the title), then renders the grid.
 */
function VideoGrid({ activeCategory }) {
  const videos = useSelector((state) => state.videos.items)
  const searchTerm = useSelector((state) => state.search.term)

  const filteredVideos = videos.filter((video) => {
    const matchesCategory = activeCategory === 'All' || video.category === activeCategory
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.trim().toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (filteredVideos.length === 0) {
    return (
      <p className="text-yt-text-secondary text-sm py-8 text-center">
        No videos found.
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