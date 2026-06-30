import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import channelRoutes from './routes/channelRoutes.js';
import commentRoutes from './routes/commentRoutes.js'

// Load environment variables from .env before a    nything else runs
dotenv.config()

// Connect to MongoDB (logs success/failure to terminal)
connectDB()

const app = express()

// Middlewares 

app.use(cors())   // allows the React frontend (different port) to call this API
app.use(express.json()) // parse incoming JSON request bodies 

// Simple health-check route - confirms the server is alive.
// Real routes (auth, videos, channels, comments) added in upcoming steps.

app.get('/', (req,res)=> {
    res.json ({message: 'Youtube Clone API is running '})
})

app.use('/api/auth', authRoutes)
app.use('/api/videos', videoRoutes)
app.use('/api/channels', channelRoutes)
app.use('/api/comments', commentRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=> {
    console.log(`Server running on http://localhost:${PORT}`)
})