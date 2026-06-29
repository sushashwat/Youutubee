import Video from '../models/Video.js'
import Channel from '../models/Channel.js'

/**
 * GET /api/videos
 * Returns all videos, with channel info populated (so frontend doesn't
 * need a separate lookup for channel name).
 * Supports optional query params: ?category=Music  and  ?search=react
 */

export async function getVideos(req,res){
        try{
            const{category,search} = req.query
            const filter = {}

            if(category && category !== 'All'){
                filter.category = category
            }
            if(search){
                filter.title = {$regex: search, $option: 'i'} // case-insensitive partial match
            }
            const videos = await Video.find(filter)
            .populate('channel', 'channelName channelBanner')
            .sort({ createdAt: -1})

            res.json(videos)
        } catch(error) {
            res.status(500).json({message: error.message})
    }
}

/**
 * GET /api/videos/:id
 * Returns one video with channel, uploader, and comments populated.
 */

export async function getVideoById(req,res) {
    try{
        const video = await Video.findById(req.params.id)
        .populate('channel', 'channelName channelBanner owner')
        .populate('uploader', 'username')
        .populate({
            path:'comments',
            populate:{path: 'user', select: 'username'},
        })
        if(!video){
            return res.status(404).json({message: 'Video not found'})
        }

        res.json(video)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

/**
 * POST /api/videos
 * Creates a video under a channel owned by the logged-in user.
 * Protected route - req.user comes from the auth middleware.
 */

export async function createVideo(req,res){
    try{
        const{title,thumbnailUrl, videoUrl, description,category, channelId} = req.body
        if(!title || !thumbnailUrl || !videoUrl || !category || !channelId) {
            return res.status(400).json({message: 'Missing required fields'})
        }
        const channel = await Channel.findById(channelId)
        if(!channel){
            return res.status(404).json({message: 'Channel not found'})
        }
        // Ownership check only the channel's owner can upload to it 
        if(channel.owner.toString() !== req.user._id.toString()){
            return res.status(403).json({message: 'Not authorized to upload to this channel'})
        } 
        const video = await Video.create({
            title,
            thumbnailUrl,
            videoUrl,
            description,
            category,
            channel: channel._id,
            uploader: req.user._id,
        })

        channel.videos.push(video._id)
        await channel.save()
        res.status(201).json(video)
    } catch(error){
        res.status(500).json({message:error.message})
    }
}

/**
 * PUT /api/videos/:id
 * Updates a video. Only the uploader can edit it.
 */

export async function updateVideo(req,res) {
    try{
        const video = await Video.findById(req.params.id)
        if(!video){
            return res.status(404).json({message: 'Video not found'})
        }
        if(video.uploader.toString() !== req.user._id.toString()){
            return res.status(403).json({message:'Not authorized to edit this video'})
        }
        const{title, thumbnailUrl,description,category} = req.body
        if(title !== undefined) video.title = title
        if(description !== undefined) video.description = description
        if(thumbnailUrl !== undefined) video.thumbnailUrl = thumbnailUrl
        if(category !== undefined) video.category = category

        const updatedVideo = await video.save()
        res.json(updatedVideo)
    } catch(error){
        res.status(500).json({message: error.message})
    }
}


/**
 * DELETE /api/videos/:id
 * Deletes a video. Only the uploader can delete it. Also removes its
 * reference from the parent channel's videos array.
 */

export async function deleteVideo(req, res) {
  try {
    const video = await Video.findById(req.params.id)
    if (!video) {
      return res.status(404).json({ message: 'Video not found' })
    }

    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this video' })
    }

    await Channel.findByIdAndUpdate(video.channel, { $pull: { videos: video._id } })
    await video.deleteOne()

    res.json({ message: 'Video deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * PATCH /api/videos/:id/react
 * Handles like/dislike. Simplified for this project's scope: no
 * per-user reaction tracking in the DB (would need a separate
 * "reactions" collection) - just increments/decrements counts based
 * on the action sent from the frontend, mirroring the frontend's
 * existing local logic.
 */

export async function reactToVideo(req, res) {
  try {
    const { action } = req.body // 'like' | 'dislike' | 'undo-like' | 'undo-dislike'
    const video = await Video.findById(req.params.id)
    if (!video) {
      return res.status(404).json({ message: 'Video not found' })
    }

    if (action === 'like') video.likes += 1
    else if (action === 'undo-like') video.likes = Math.max(0, video.likes - 1)
    else if (action === 'dislike') video.dislikes += 1
    else if (action === 'undo-dislike') video.dislikes = Math.max(0, video.dislikes - 1)
    else return res.status(400).json({ message: 'Invalid action' })

    await video.save()
    res.json({ likes: video.likes, dislikes: video.dislikes })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
