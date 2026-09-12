import jwt from 'jsonwebtoken'

const generateAccessToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )
}

const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )
}

const generateTokens = (userId) => {
    const accessToken = generateAccessToken(userId)
    const refreshToken = generateRefreshToken(userId)
    return { accessToken, refreshToken }
}

export { generateAccessToken, generateRefreshToken, generateTokens }