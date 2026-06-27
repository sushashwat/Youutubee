import mongoose from "mongoose";

/**
 * Video Schema
 * -------------
 * Matches the assignment's sample video data shape. `comments` is kept
 * as a list of ObjectId references.
 */

const videoSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        thumbnailUrl: { type: String, required: true },
        videoUrl: { type: String, required: true },
        description: { type: String, default: '' },
        channel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
        uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        category: { type: String, required: true },
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        dislikes: { type: Number, default: 0 },
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    },
    {timestamps: true} //CreatedAt acts as the upload date
)
export default mongoose.model('Video',videoSchema)
