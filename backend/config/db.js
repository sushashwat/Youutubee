import mongoose from "mongoose";

/**
 * connectDB
 * ----------
 * Connects to MongoDB using the URI from .env (MONGO_URI).
 * Called once when the server starts. If the connection fails, the process exits - the API is useless without a database anyway.
 */

async function connectDB(){
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
            console.log(`MongoDB connected: ${conn.connection.host}`)       
    }catch(error){
        console.error(`MongoDb connection error: ${error.message}`)
        process.exit(1)
    }
}
export default connectDB




