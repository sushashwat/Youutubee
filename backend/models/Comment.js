import mongoose from "mongoose";
/**
 * Comment Schema
 * ---------------
 * Stored as its own collection (not embedded inside Video) so that
 * add/edit/delete on a single comment doesn't require rewriting the
 * entire video document. Linked back to its video via `video` field.
 */

const commentSchema = new mongoose.Schema(
    {
        text:{type:String, required:true, trim:true},
        user:{type: mongoose.Schema.Types.ObjectId, ref:'User', required: true},
        video:{type: mongoose.Schema.Types.ObjectId, ref:'Video', required: true},
    },
    {timestamps: true}
)

export default mongoose.model('Comment', commentSchema)
