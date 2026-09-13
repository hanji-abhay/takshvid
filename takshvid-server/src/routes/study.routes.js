import { Router } from 'express'
import { verifyToken } from '../middleware/auth.middleware.js'

const router = Router()
const DJANGO_URL = process.env.DJANGO_URL || 'http://127.0.0.1:8000'

// Proxy to Django
const proxyToDjango = async (req, res, next) => {
    try {
        const path = req.originalUrl.replace('/api/study', '/api')
        const response = await fetch(`${DJANGO_URL}${path}`)
        const data = await response.json()
        return res.status(response.status).json(data)
    } catch (error) {
        next(error)
    }
}

// All routes protected
router.use(verifyToken)

router.get('/states', proxyToDjango)
router.get('/universities/:state_id', proxyToDjango)
router.get('/courses/:university_id', proxyToDjango)
router.get('/subjects/:course_id/:semester', proxyToDjango)
router.get('/notes/:subject_id', proxyToDjango)
router.get('/books/:subject_id', proxyToDjango)
router.get('/pyqs/:subject_id', proxyToDjango)

export default router