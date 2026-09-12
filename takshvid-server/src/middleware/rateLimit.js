import rateLimit from 'express-rate-limit'

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
        success: false,
        message: 'Too many requests, please try again after 15 minutes'
    }
})

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: {
        success: false,
        message: 'Too many login attempts, please try again after 15 minutes'
    }
})

const kyvyaLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20,
    message: {
        success: false,
        message: 'Too many KYVYA requests, please slow down'
    }
})

export { globalLimiter, authLimiter, kyvyaLimiter }