import { Router } from 'express'
import {
    getProfile,
    updateProfile,
    updateAcademicInfo,
    updateKyvyaPreferences,
    getUserProgress
} from '../controllers/user.controller.js'
import { verifyToken } from '../middleware/auth.middleware.js'

const router = Router()

// All user routes are protected
router.use(verifyToken)

router.get('/profile', getProfile)
router.put('/profile', updateProfile)
router.put('/academic', updateAcademicInfo)
router.put('/kyvya-preferences', updateKyvyaPreferences)
router.get('/progress', getUserProgress)

export default router