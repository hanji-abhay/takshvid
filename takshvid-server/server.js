import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectMongoDB from './src/config/db.js'
import { connectPostgres } from './src/config/postgres.js'
import { connectCloudinary } from './src/config/cloudinary.js'
import { globalLimiter } from './src/middleware/rateLimit.js'
import errorHandler from './src/middleware/errorHandler.js'
import authRoutes from './src/routes/auth.routes.js'
import userRoutes from './src/routes/user.routes.js'
import kyvyaRoutes from './src/routes/kyvya.routes.js'
import studyRoutes from './src/routes/study.routes.js'
import learnRoutes from './src/routes/learn.routes.js'
import codeRoutes from './src/routes/code.routes.js'

const app = express()

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(globalLimiter)

// Database Connections
connectMongoDB()
connectPostgres()
connectCloudinary()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/kyvya', kyvyaRoutes)
app.use('/api/study', studyRoutes)
app.use('/api/learn', learnRoutes)
app.use('/api/code', codeRoutes)

// Test Route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'TAKSHVID Server Running 🚀'
    })
})

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    })
})

// Error Handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`TAKSHVID Server running on port ${PORT}`)
})