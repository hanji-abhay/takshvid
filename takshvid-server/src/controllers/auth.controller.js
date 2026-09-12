import crypto from 'crypto'
import User from '../models/User.js'
import UserProgress from '../models/UserProgress.js'
import Notification from '../models/Notification.js'
import { ApiResponse, ApiError } from '../utils/apiResponse.js'
import { generateTokens } from '../utils/generateTokens.js'
import { validateEmail, validatePassword, validateName } from '../utils/validators.js'
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/mail.service.js'

// Register
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body

        // Validate
        if (!validateName(name)) {
            throw new ApiError(400, 'Name must be at least 2 characters')
        }
        if (!validateEmail(email)) {
            throw new ApiError(400, 'Invalid email address')
        }
        if (!validatePassword(password)) {
            throw new ApiError(400, 'Password must be 8+ characters with uppercase, lowercase and number')
        }

        // Check existing user
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            throw new ApiError(409, 'Email already registered')
        }

        // Create verification token
        const verificationToken = crypto.randomBytes(32).toString('hex')
        const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            verificationToken,
            verificationExpiry
        })

        // Create user progress document
        await UserProgress.create({ userId: user._id })

        // Create welcome notification
        await Notification.create({
            userId: user._id,
            type: 'welcome',
            title: 'Welcome to TAKSHVID',
            message: `Hey ${name}, your journey begins here. Verify your email to get started.`
        })

        // Send verification email
        await sendVerificationEmail(email, name, verificationToken)

        return res.status(201).json(
            new ApiResponse(201, {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified
            }, 'Registration successful. Please verify your email.')
        )

    } catch (error) {
        next(error)
    }
}

// Verify Email
const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params

        const user = await User.findOne({
            verificationToken: token,
            verificationExpiry: { $gt: Date.now() }
        })

        if (!user) {
            throw new ApiError(400, 'Invalid or expired verification link')
        }

        user.isVerified = true
        user.verificationToken = undefined
        user.verificationExpiry = undefined
        await user.save()

        await Notification.create({
            userId: user._id,
            type: 'email_verified',
            title: 'Email Verified',
            message: 'Your email has been verified. Welcome to TAKSHVID!'
        })

        return res.status(200).json(
            new ApiResponse(200, null, 'Email verified successfully')
        )

    } catch (error) {
        next(error)
    }
}

// Login
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            throw new ApiError(400, 'Email and password are required')
        }

        // Find user with password
        const user = await User.findOne({ email }).select('+password +refreshToken')

        if (!user) {
            throw new ApiError(401, 'Invalid email or password')
        }

        // Compare password
        const isPasswordValid = await user.comparePassword(password)
        if (!isPasswordValid) {
            throw new ApiError(401, 'Invalid email or password')
        }

        if (!user.isVerified) {
            throw new ApiError(403, 'Please verify your email before logging in')
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user._id)

        // Save refresh token
        user.refreshToken = refreshToken
        await user.save()

        return res.status(200)
            .cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000 // 15 minutes
            })
            .cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })
            .json(
                new ApiResponse(200, {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    isVerified: user.isVerified,
                    academic: user.academic,
                    kyvya: user.kyvya
                }, 'Login successful')
            )

    } catch (error) {
        next(error)
    }
}

// Logout
const logout = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user._id, {
            refreshToken: null
        })

        return res.status(200)
            .clearCookie('accessToken')
            .clearCookie('refreshToken')
            .json(new ApiResponse(200, null, 'Logged out successfully'))

    } catch (error) {
        next(error)
    }
}

// Refresh Token
const refreshToken = async (req, res, next) => {
    try {
        const incomingRefreshToken = req.cookies?.refreshToken

        if (!incomingRefreshToken) {
            throw new ApiError(401, 'Unauthorized')
        }

        const user = await User.findOne({
            refreshToken: incomingRefreshToken
        }).select('+refreshToken')

        if (!user) {
            throw new ApiError(401, 'Invalid refresh token')
        }

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id)

        user.refreshToken = newRefreshToken
        await user.save()

        return res.status(200)
            .cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000
            })
            .cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            .json(new ApiResponse(200, { accessToken }, 'Token refreshed'))

    } catch (error) {
        next(error)
    }
}

// Forgot Password
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body

        if (!validateEmail(email)) {
            throw new ApiError(400, 'Invalid email address')
        }

        const user = await User.findOne({ email })

        if (!user) {
            // security ke liye same response dete hain
            return res.status(200).json(
                new ApiResponse(200, null, 'If this email exists, a reset link has been sent')
            )
        }

        const resetToken = crypto.randomBytes(32).toString('hex')
        user.resetPasswordToken = resetToken
        user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
        await user.save()

        await sendPasswordResetEmail(email, user.name, resetToken)

        return res.status(200).json(
            new ApiResponse(200, null, 'If this email exists, a reset link has been sent')
        )

    } catch (error) {
        next(error)
    }
}

// Reset Password
const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params
        const { password } = req.body

        if (!validatePassword(password)) {
            throw new ApiError(400, 'Password must be 8+ characters with uppercase, lowercase and number')
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiry: { $gt: Date.now() }
        })

        if (!user) {
            throw new ApiError(400, 'Invalid or expired reset link')
        }

        user.password = password
        user.resetPasswordToken = undefined
        user.resetPasswordExpiry = undefined
        await user.save()

        return res.status(200).json(
            new ApiResponse(200, null, 'Password reset successful')
        )

    } catch (error) {
        next(error)
    }
}

export {
    register,
    verifyEmail,
    login,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword
}