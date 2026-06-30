import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * protect middleware
 * --------------------
 * Reads the JWT from the "Authorization: Bearer <token>" header,
 * verifies it, and attaches the matching user (minus password) to
 * req.user. Any route using this middleware requires a valid token.
 * Used later for: create/edit/delete video, create channel, add comment.
 */

async function protect(req,res,next){
    let token 
    const authHeader = req.headers.authorization
    if(authHeader && authHeader.startsWith('Bearer ')){
        token = authHeader.split(' ')[1]
    }

    if(!token){
        return res.status(401).json({ message: 'Not Authorized, no token'})
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id).select('-password')
        
        if(!req.user){
            return res.status(401).json({message: 'User not found '})
        }
        next()
    } catch (error){
        return res.status(401).json({message: 'Not authorized, token failed'})
    }
}
export default protect