import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import api from '../api/axios'
import { formatViews, formatTimeAgo } from '../utils/formatters'
import CommentSection from '../components/CommentSection'

/**
 * VideoPlayer Page
 * -----------------
 * Route: "/video/:videoId" (videoId is MongoDB _id now)
 * Fetches the video from backend on mount. Passes real comment data
 * (from the populated video object) to CommentSection.
 */

function VideoPlayer() {
  const { videoId } = useParams()

  const[video,setVideo] = useState(null)
  const[loading, setLoading] = useState(true)
  const[likes, setLikes] = useState(0)
  const[dislikes,setDislikes] = useState(0)
  const[userReaction, setUserReaction]= useState(null) 

  const[recommended, setRecommended] = useState([])
  const [recLoading, setRecLoading] = useState(true)
  
  useEffect(()=>{
    async function fetchVideo(){
      try{
        setLoading(true)
        const{data} = await api.get(`/videos/${videoId}`)
        setVideo(data)
        setLikes(data.likes)
        setDislikes(data.dislikes)
        setUserReaction(null)
      } catch (err) {
        console.error('Failed to fetch video:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchVideo()
  }, [videoId])


  // fetch all videos for the sidebar, excluding the one currently playing
  useEffect(() => {
    async function fetchRecommended() {
      try {
        setRecLoading(true)
        const { data } = await api.get('/videos')
        setRecommended(data.filter((v) => v._id !== videoId))
      } catch (err) {
        console.error('Failed to fetch recommended videos:', err)
      } finally {
        setRecLoading(false)
      }
    }
    fetchRecommended()
  }, [videoId])


 async function handleLike() {
    const action = userReaction === 'like' ? 'undo-like' : 'like'
    try {
      const { data } = await api.patch(`/videos/${videoId}/react`, { action })
      setLikes(data.likes)
      setDislikes(data.dislikes)
      setUserReaction(userReaction === 'like' ? null : 'like')
    } catch (err) {
      console.error('React failed:', err)
    }
  }

   async function handleDislike() {
    const action = userReaction === 'dislike' ? 'undo-dislike' : 'dislike'
    try {
      const { data } = await api.patch(`/videos/${videoId}/react`, { action })
      setLikes(data.likes)
      setDislikes(data.dislikes)
      setUserReaction(userReaction === 'dislike' ? null : 'dislike')
    } catch (err) {
      console.error('React failed:', err)
    }
  }


  if (loading) {
    return (
      <div className="max-w-4xl animate-pulse">
        <div className="aspect-video rounded-xl bg-yt-hover-bg" />
        <div className="mt-3 h-6 bg-yt-hover-bg rounded w-3/4" />
        <div className="mt-2 h-4 bg-yt-hover-bg rounded w-1/4" />
      </div>
    )
  }


  if (!video) {
    return <p className="text-yt-text-secondary">Video not found.</p>
  }


  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* LEFT: main video content */}
      <div className="max-w-4xl flex-1">
        <video
          src={video.videoUrl}
          controls
          className="w-full aspect-video rounded-xl bg-yt-black"
        />

        <h1 className="text-lg font-semibold mt-3">{video.title}</h1>

        <div className="flex items-center justify-between mt-2 flex-wrap gap-3">
          <div>
            <p className="font-medium">{video.channel?.channelName ?? 'Unknown channel'}</p>
            <p className="text-xs text-yt-text-secondary">
              {formatViews(video.views)} • {formatTimeAgo(video.createdAt)}
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

        <p className="bg-yt-hover-bg rounded-xl p-3 mt-3 text-sm whitespace-pre-line">
          {video.description}
        </p>

        <CommentSection videoId={video._id} initialComments={video.comments ?? []} />
      </div>

      {/* RIGHT: recommended videos sidebar */}
      <div className="w-full lg:w-[400px] shrink-0">
        {recLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-2 animate-pulse">
                <div className="w-40 aspect-video bg-yt-hover-bg rounded-xl shrink-0" />
                <div className="flex-1 space-y-2 mt-1">
                  <div className="h-4 bg-yt-hover-bg rounded w-full" />
                  <div className="h-3 bg-yt-hover-bg rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {recommended.map((rec) => (
              <Link
                key={rec._id}
                to={`/video/${rec._id}`}
                className="flex gap-2 group"
              >
                <div className="w-40 aspect-video rounded-xl overflow-hidden bg-yt-hover-bg shrink-0">
                  <img
                    src={rec.thumbnailUrl}
                    alt={rec.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium line-clamp-2">{rec.title}</h3>
                  <p className="text-xs text-yt-text-secondary mt-1">
                    {rec.channel?.channelName ?? 'Unknown channel'}
                  </p>
                  <p className="text-xs text-yt-text-secondary">
                    {formatViews(rec.views)} • {formatTimeAgo(rec.createdAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoPlayer