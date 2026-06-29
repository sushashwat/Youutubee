import express from 'express'
import {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  reactToVideo,
} from '../controllers/videoController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

// Public routes - anyone can browse videos
router.get('/', getVideos)
router.get('/:id', getVideoById)

// Protected routes - require a valid JWT (Authorization: Bearer <token>)
router.post('/', protect, createVideo)
router.put('/:id', protect, updateVideo)
router.delete('/:id', protect, deleteVideo)
router.patch('/:id/react', protect, reactToVideo)

export default router