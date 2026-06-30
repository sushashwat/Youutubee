import express from 'express'
import { addComment, updateComment, deleteComment } from '../controllers/commentController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

// All comment actions require login - matches assignment spec
// ("Users should be able to add, edit, and delete comments").
router.post('/', protect, addComment)
router.put('/:id', protect, updateComment)
router.delete('/:id', protect, deleteComment)

export default router