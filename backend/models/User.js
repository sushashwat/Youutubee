import mongoose from 'mongoose'

/**
 * User Schema
 * ------------
 * Matches the assignment's sample user data shape.
 * password is stored as a bcrypt hash (never plaintext) - hashing
 * happens in the auth controller, not here.
 */
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    channels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }],
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
)

export default mongoose.model('User', userSchema)