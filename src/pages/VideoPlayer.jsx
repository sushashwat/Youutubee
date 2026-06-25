import { useParams } from 'react-router-dom'

/**
 * VideoPlayer Page
 * -----------------
 * Route: "/video/:videoId"
 * Full player, like/dislike, comments CRUD built in the next step.
 * For now this just proves routing + URL params work.
 */
function VideoPlayer() {
  const { videoId } = useParams()

  return (
    <div>
      <p>Video Player page for: {videoId}</p>
      <p>Full player, comments, like/dislike coming in the next step.</p>
    </div>
  )
}

export default VideoPlayer