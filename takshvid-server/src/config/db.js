import mongoose from 'mongoose'
import dns from 'dns'

dns.setServers(['1.1.1.1', '1.0.0.1'])

const connectMongoDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(`MongoDB Error: ${error.message}`)
        process.exit(1)
    }
}

export default connectMongoDB