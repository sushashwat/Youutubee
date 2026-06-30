import express from 'express'
import { getChannelById, getMyChannel, createChannel } from '../controllers/channelController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router();
// IMPORTANT: /mine must come BEFORE /:id - otherwise Express would treat
// "mine" as a value for the :id parameter and try to look up a channel
// with _id = "mine" (which is not a valid ObjectId, causing a crash).

router.get('/mine' , protect,getMyChannel)
router.get('/:id', getChannelById)

router.post('/', protect, createChannel)

export default router