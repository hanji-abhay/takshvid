import { Router } from 'express'
import {
    chat,
    getChatHistory,
    getAllSessions,
    deleteSession,
    semanticSearch
} from '../controllers/kyvya.controller.js'
import { verifyToken } from '../middleware/auth.middleware.js'
import { kyvyaLimiter } from '../middleware/rateLimit.js'

const router = Router()

// All routes protected
router.use(verifyToken)
router.use(kyvyaLimiter)

router.post('/chat', chat)
router.get('/sessions', getAllSessions)
router.get('/history/:sessionId', getChatHistory)
router.delete('/session/:sessionId', deleteSession)
router.post('/search', semanticSearch)

export default router