import { useState } from 'react'
import { formatTimeAgo } from '../utils/formatters'

/**
 * CommentItem Component
 * ------------------------
 * Renders a single comment. If `canModify` is true (comment belongs to
 * the current user), shows Edit/Delete actions. Edit toggles an inline textbox in place of the static text.
 *
 * Props:
 *  - comment: { commentId, userId, text, timestamp }
 *  - username: display name of the comment's author
 *  - canModify: whether to show edit/delete controls
 *  - onEdit(commentId, newText), onDelete(commentId): handlers from parent
 */
function CommentItem({ comment, username, canModify, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(comment.text)

  function saveEdit() {
    const trimmed = editText.trim()
    if (!trimmed) return
    onEdit(comment.commentId, trimmed)
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
              onClick={() => onDelete(comment.commentId)}
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