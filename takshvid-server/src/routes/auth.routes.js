import { Router } from 'express'
import {
    register,
    verifyEmail,
    login,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword
} from '../controllers/auth.controller.js'
import { verifyToken } from '../middleware/auth.middleware.js'
import { authLimiter } from '../middleware/rateLimit.js'

const router = Router()

// Public routes
router.post('/register', authLimiter, register)
router.post('/login', authLimiter, login)
router.get('/verify-email/:token', verifyEmail)
router.post('/forgot-password', authLimiter, forgotPassword)
router.post('/reset-password/:token', resetPassword)
router.post('/refresh-token', refreshToken)

// Protected routes
router.post('/logout', verifyToken, logout)

export default router