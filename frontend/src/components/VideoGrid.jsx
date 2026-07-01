import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchVideos } from '../redux/slices/videosSlice'
import VideoCard from './VideoCard'

/**
 * VideoGrid Component
 * --------------------
 * Fetches videos from the backend on mount and whenever the active
 * category or search term changes. Renders a responsive grid of cards.
 */

function VideoGrid({ activeCategory }) {
  const dispatch = useDispatch()
  const {items: videos, status} = useSelector((state)=> state.videos)
  const searchTerm = useSelector((state) => state.search.term)

  // Refetch whenever category or search changes

  useEffect(()=>{
    dispatch(fetchVideos({category: activeCategory, search: searchTerm}))
  },[dispatch, activeCategory, searchTerm])

  if(status === 'loading'){
     return (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-video rounded-xl bg-yt-hover-bg" />
            <div className="mt-3 h-4 bg-yt-hover-bg rounded w-3/4" />
            <div className="mt-2 h-3 bg-yt-hover-bg rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }


  if (status === 'failed') {
    return (
      <p className="text-red-500 text-sm py-8 text-center">
        Failed to load videos. Is the backend running?
      </p>
    )
  }

   if (videos.length === 0) {
    return (
      <p className="text-yt-text-secondary text-sm py-8 text-center">
        No videos found.
      </p>
    )
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  )
}
export default VideoGrid