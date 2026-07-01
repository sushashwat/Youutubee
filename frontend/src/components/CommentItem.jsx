import { useState } from 'react'
import { formatTimeAgo } from '../utils/formatters'

/**
 * CommentItem Component
 * ------------------------
 * Renders a single comment. If `canModify` is true (comment belongs to
 * the current logged-in user), shows Edit/Delete actions.
 * Uses comment._id (MongoDB) instead of comment.commentId (old mock data).
 *
 * Props:
 *  - comment: { _id, text, createdAt, user: { username } }
 *  - username: display name of the comment author
 *  - canModify: whether to show edit/delete controls
 *  - onEdit(_id, newText), onDelete(_id): handlers from CommentSection
 */

function CommentItem({ comment, username, canModify, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(comment.text)

  function saveEdit() {
    const trimmed = editText.trim()
    if (!trimmed) return
    onEdit(comment._id, trimmed)
    setIsEditing(false)
  }

  return (
    <div className="flex gap-3">
      {/* Avatar placeholder - initial letter circle, no real images yet */}
      <div className="w-9 h-9 rounded-full bg-yt-hover-bg flex items-center justify-center text-sm font-medium shrink-0">
        {username.charAt(0).toUpperCase()}
      </div>

      <div className="flex-1">
        <p className="text-sm">
          <span className="font-medium mr-2">@{username}</span>
          <span className="text-xs text-yt-text-secondary">
            {formatTimeAgo(comment.timestamp)}
          </span>
        </p>

        {isEditing ? (
          <div className="mt-1 flex gap-2">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="flex-1 border-b border-yt-border outline-none text-sm pb-1"
              autoFocus
            />
            <button onClick={saveEdit} className="text-xs font-medium text-blue-600">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="text-xs text-yt-text-secondary">
              Cancel
            </button>
          </div>
        ) : (
          <p className="text-sm mt-0.5">{comment.text}</p>
        )}

        {/* Only the comment's own author sees these (per assignment spec) */}
        {canModify && !isEditing && (
          <div className="flex gap-3 mt-1">
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs text-yt-text-secondary hover:text-yt-black"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(comment._id)}
              className="text-xs text-yt-text-secondary hover:text-yt-black"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CommentItem