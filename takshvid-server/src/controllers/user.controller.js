import User from '../models/User.js'
import UserProgress from '../models/UserProgress.js'
import { ApiResponse, ApiError } from '../utils/apiResponse.js'

// Get Profile
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)

        if (!user) {
            throw new ApiError(404, 'User not found')
        }

        return res.status(200).json(
            new ApiResponse(200, user, 'Profile fetched successfully')
        )

    } catch (error) {
        next(error)
    }
}

// Update Profile
const updateProfile = async (req, res, next) => {
    try {
        const { name, avatar } = req.body

        if (name && name.trim().length < 2) {
            throw new ApiError(400, 'Name must be at least 2 characters')
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                ...(name && { name }),
                ...(avatar && { avatar })
            },
            { new: true }
        )

        return res.status(200).json(
            new ApiResponse(200, updatedUser, 'Profile updated successfully')
        )

    } catch (error) {
        next(error)
    }
}

// Update Academic Info
const updateAcademicInfo = async (req, res, next) => {
    try {
        const { stateId, universityId, courseId, semester } = req.body

        if (!stateId || !universityId || !courseId || !semester) {
            throw new ApiError(400, 'All academic fields are required')
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                academic: {
                    stateId,
                    universityId,
                    courseId,
                    semester
                }
            },
            { new: true }
        )

        return res.status(200).json(
            new ApiResponse(200, updatedUser, 'Academic info updated successfully')
        )

    } catch (error) {
        next(error)
    }
}

// Update KYVYA Preferences
const updateKyvyaPreferences = async (req, res, next) => {
    try {
        const { personalityMode, language, responseStyle } = req.body

        const validModes = ['bestie', 'nerd', 'guide', 'lover', 'hype', 'poetry']
        const validStyles = ['brief', 'medium', 'detailed']

        if (personalityMode && !validModes.includes(personalityMode)) {
            throw new ApiError(400, 'Invalid personality mode')
        }

        if (responseStyle && !validStyles.includes(responseStyle)) {
            throw new ApiError(400, 'Invalid response style')
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                ...(personalityMode && { 'kyvya.personalityMode': personalityMode }),
                ...(language && { 'kyvya.language': language }),
                ...(responseStyle && { 'kyvya.responseStyle': responseStyle })
            },
            { new: true }
        )

        return res.status(200).json(
            new ApiResponse(200, updatedUser, 'KYVYA preferences updated successfully')
        )

    } catch (error) {
        next(error)
    }
}

// Get User Progress
const getUserProgress = async (req, res, next) => {
    try {
        const progress = await UserProgress.findOne({ userId: req.user._id })

        if (!progress) {
            throw new ApiError(404, 'Progress not found')
        }

        return res.status(200).json(
            new ApiResponse(200, progress, 'Progress fetched successfully')
        )

    } catch (error) {
        next(error)
    }
}

export {
    getProfile,
    updateProfile,
    updateAcademicInfo,
    updateKyvyaPreferences,
    getUserProgress
}