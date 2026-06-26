import { useState } from 'react'
import { mockCurrentUser } from '../data/currentUser'
import { users } from '../data/users'
import CommentItem from './CommentItem'

/**
 * CommentSection Component
 * --------------------------
 * Manages the full comment list for a video: add new comment, and renders CommentItem for each (which handles its own edit/delete).
 *
 * Props:
 *  - initialComments (array): the video's comments from mock data.
 *    Stored in local state so add/edit/delete update the UI immediately.
 *    Will be replaced by API calls once backend exists.
 */
function CommentSection({ initialComments }) {
  const [comments, setComments] = useState(initialComments)
  const [newCommentText, setNewCommentText] = useState('')

  function handleAddComment() {
    const trimmed = newCommentText.trim()
    if (!trimmed) return // ignore empty submissions

    const newComment = {
      commentId: `comment-${Date.now()}`, // temporary unique id (mock data only)
      userId: mockCurrentUser.userId,
      text: trimmed,
      timestamp: new Date().toISOString(),
    }

    setComments((prev) => [newComment, ...prev])
    setNewCommentText('')
  }

  function handleEditComment(commentId, newText) {
    setComments((prev) =>
      prev.map((c) => (c.commentId === commentId ? { ...c, text: newText } : c))
    )
  }

  function handleDeleteComment(commentId) {
    setComments((prev) => prev.filter((c) => c.commentId !== commentId))
  }

  return (
    <div className="mt-6">
      <h2 className="font-medium mb-4">{comments.length} Comments</h2>

      {/* Add comment input */}
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
          className="text-sm font-medium px-4 py-1.5 bg-yt-black text-yt-white rounded-full disabled:opacity-40"
          disabled={!newCommentText.trim()}
        >
          Comment
        </button>
      </div>

      {/* Comment list */}
      <div className="flex flex-col gap-4">
        {comments.map((comment) => {
          const commentUser = users.find((u) => u.userId === comment.userId)
          return (
            <CommentItem
              key={comment.commentId}
              comment={comment}
              username={commentUser?.username ?? mockCurrentUser.username}
              // Only show edit/delete on comments that belong to the
              // current user (matches assignment requirement)
              canModify={comment.userId === mockCurrentUser.userId}
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