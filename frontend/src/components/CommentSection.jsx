import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../api/axios'
import CommentItem from './CommentItem'

/**
 * CommentSection Component
 * --------------------------
 * Full CRUD for comments on a video, using the real backend.
 * Props:
 *  - videoId: MongoDB _id of the video
 *  - initialComments: populated comment array from the video fetch
 */


function CommentSection({videoId, initialComments }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const [comments, setComments] = useState(initialComments)
  const [newCommentText, setNewCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)

    async function handleAddComment() {
    const trimmed = newCommentText.trim()
    if (!trimmed || !isAuthenticated) return

    try {
      setSubmitting(true)
      const { data } = await api.post('/comments', { text: trimmed, videoId })
      setComments((prev) => [data, ...prev])
      setNewCommentText('')
    } catch (err) {
      console.error('Add comment failed:', err)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEditComment(commentId, newText) {
    try {
      const { data } = await api.put(`/comments/${commentId}`, { text: newText })
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? { ...c, text: data.text } : c))
      )
    } catch (err) {
      console.error('Edit comment failed:', err)
    }
  }

async function handleDeleteComment(commentId) {
    try {
      await api.delete(`/comments/${commentId}`)
      setComments((prev) => prev.filter((c) => c._id !== commentId))
    } catch (err) {
      console.error('Delete comment failed:', err)
    }
  }

    return (
    <div className="mt-6">
      <h2 className="font-medium mb-4">{comments.length} Comments</h2>

      {isAuthenticated ? (
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 border-b border-yt-border outline-none focus:border-yt-black pb-1 text-sm"
          />
          <button
            onClick={handleAddComment}
            disabled={!newCommentText.trim() || submitting}
            className="text-sm font-medium px-4 py-1.5 bg-yt-black text-yt-white rounded-full disabled:opacity-40"
          >
            {submitting ? 'Posting...' : 'Comment'}
          </button>
        </div>
      ) : (
        <p className="text-sm text-yt-text-secondary mb-6">
          <Link to="/login" className="text-blue-600 font-medium">Sign in</Link> to comment.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            username={comment.user?.username ?? 'Unknown'}
            canModify={isAuthenticated && comment.user?._id === user?._id}
            onEdit={handleEditComment}
            onDelete={handleDeleteComment}
          />
        ))}
      </div>
    </div>
  )
}

export default CommentSection