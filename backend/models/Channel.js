import mongoose from "mongoose";

/**
 * Channel Schema
 * ---------------
 * One user can own multiple channels in theory, but this project's
 * Create Channel flow assumes one channel per user for simplicity.
 */

const channelSchema = new mongoose.Schema(
    {
        channelName: {type: String, required:true, trim: true},
        owner:{type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
        description: {type: String, default:'' },
        channelBanner: {type: String, default:''},
        subscribers: {type: Number, default:'0'},
        videos:[{type:mongoose.Schema.Types.ObjectId, ref:'Video'}],
    },
    {timestamps: true}
)

export default mongoose.model('Channel', channelSchema)
