import jwt from 'jsonwebtoken'

/**
 * generateToken
 * --------------
 * Creates a signed JWT containing the user's MongoDB _id.
 * Expires in 7 days - after that, the user must log in again.
 */


function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

export default generateToken
