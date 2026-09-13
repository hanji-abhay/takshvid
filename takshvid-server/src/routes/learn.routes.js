import { Router } from 'express'
import { verifyToken } from '../middleware/auth.middleware.js'

const router = Router()
const DJANGO_URL = process.env.DJANGO_URL || 'http://127.0.0.1:8000'

const proxyToDjango = async (req, res, next) => {
    try {
        const path = req.originalUrl.replace('/api/learn', '/api')
        const response = await fetch(`${DJANGO_URL}${path}`)
        const data = await response.json()
        return res.status(response.status).json(data)
    } catch (error) {
        next(error)
    }
}

// All routes protected
router.use(verifyToken)

router.get('/paths', proxyToDjango)
router.get('/paths/:slug', proxyToDjango)
router.get('/module/:id', proxyToDjango)

export default router