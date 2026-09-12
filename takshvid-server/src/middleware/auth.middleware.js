import jwt from 'jsonwebtoken'
import { ApiError } from '../utils/apiResponse.js'
import User from '../models/User.js'

const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || 
            req.headers?.authorization?.replace('Bearer ', '')

        if (!token) {
            throw new ApiError(401, 'Unauthorized - No token provided')
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decoded.userId)

        if (!user) {
            throw new ApiError(401, 'Unauthorized - User not found')
        }

        req.user = user
        next()

    } catch (error) {
        res.status(error.statusCode || 401).json({
            success: false,
            message: error.message || 'Unauthorized'
        })
    }
}

export { verifyToken }