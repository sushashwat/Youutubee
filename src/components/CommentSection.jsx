import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { users } from '../data/users'
import CommentItem from './CommentItem'

function CommentSection({ initialComments }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const [comments, setComments] = useState(initialComments)
  const [newCommentText, setNewCommentText] = useState('')

  function handleAddComment() {
    const trimmed = newCommentText.trim()
    if (!trimmed || !isAuthenticated) return

    const newComment = {
      commentId: `comment-${Date.now()}`,
      userId: user.userId,
      text: trimmed,
      timestamp: new Date().toISOString(),
    }

    setComments((prev) => [newComment, ...prev])
    setNewCommentText('')
  }

  function handleEditComment(commentId, newText) {
    setComments((prev) => prev.map((c) => (c.commentId === commentId ? { ...c, text: newText } : c)))
  }

  function handleDeleteComment(commentId) {
    setComments((prev) => prev.filter((c) => c.commentId !== commentId))
  }

  return (
    <div className="mt-6">
      <h2 className="font-medium mb-4">{comments.length} Comments</h2>

      {isAuthenticated ? (
        <div className="flex gap-3 mb-6">
          <input
            type="text" value={newCommentText} onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 border-b border-yt-border outline-none focus:border-yt-black pb-1 text-sm"
          />
          <button
            onClick={handleAddComment}
            className="text-sm font-medium px-4 py-1.5 bg-yt-black text-yt-white rounded-full disabled:opacity-40"
            disabled={!newCommentText.trim()}
          >
            Comment
          </button>
        </div>
      ) : (
        <p className="text-sm text-yt-text-secondary mb-6">
          <Link to="/login" className="text-blue-600 font-medium">Sign in</Link> to comment.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {comments.map((comment) => {
          const commentUser = users.find((u) => u.userId === comment.userId)
          const displayName =
            commentUser?.username ?? (comment.userId === user?.userId ? user.username : 'Unknown')

          return (
            <CommentItem
              key={comment.commentId}
              comment={comment}
              username={displayName}
              canModify={isAuthenticated && comment.userId === user.userId}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
            />
          )
        })}
      </div>
    </div>
  )
}

export default CommentSection