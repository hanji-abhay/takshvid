import { Router } from 'express'
import {
    submitCode,
    runCode,
    getSubmissions
} from '../controllers/code.controller.js'
import { verifyToken } from '../middleware/auth.middleware.js'

const router = Router()

// All routes protected
router.use(verifyToken)

router.post('/run', runCode)
router.post('/submit', submitCode)
router.get('/submissions', getSubmissions)

export default router