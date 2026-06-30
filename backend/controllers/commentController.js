import Comment from '../models/Comment.js'
import Video from '../models/Video.js'

/**
 * POST /api/comments
 * Adds a comment to a video. Protected - the comment author is always
 * the logged-in user (req.user), never trusted from the request body.
 */
export async function addComment(req, res) {
  try {
    const { text, videoId } = req.body

    if (!text || !videoId) {
      return res.status(400).json({ message: 'Comment text and videoId are required' })
    }

    const video = await Video.findById(videoId)
    if (!video) {
      return res.status(404).json({ message: 'Video not found' })
    }

    const comment = await Comment.create({
      text,
      user: req.user._id,
      video: videoId,
    })

    video.comments.push(comment._id)
    await video.save()

    const populatedComment = await comment.populate('user', 'username')

    res.status(201).json(populatedComment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * PUT /api/comments/:id
 * Edits a comment. Only the comment's own author can edit it.
 */
export async function updateComment(req, res) {
  try {
    const comment = await Comment.findById(req.params.id)
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' })
    }

    const { text } = req.body
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' })
    }

    comment.text = text.trim()
    await comment.save()

    res.json(comment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * DELETE /api/comments/:id
 * Deletes a comment. Only the comment's own author can delete it.
 * Also removes the reference from the parent video's comments array.
 */
export async function deleteComment(req, res) {
  try {
    const comment = await Comment.findById(req.params.id)
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' })
    }

    await Video.findByIdAndUpdate(comment.video, { $pull: { comments: comment._id } })
    await comment.deleteOne()

    res.json({ message: 'Comment deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}