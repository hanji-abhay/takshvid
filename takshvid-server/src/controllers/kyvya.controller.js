import { getKyvyaResponse, getEmbeddings } from '../services/kyvya.service.js'
import KyvyaChat from '../models/KyvyaChat.js'
import { ApiResponse, ApiError } from '../utils/apiResponse.js'
import { v4 as uuidv4 } from 'uuid'

// Chat with KYVYA
const chat = async (req, res, next) => {
    try {
        const {
            message,
            sessionId,
            context = 'general',
            subjectContext = null
        } = req.body

        if (!message || message.trim().length === 0) {
            throw new ApiError(400, 'Message is required')
        }

        const user = req.user

        // Get or create session
        let session = null
        let chatHistory = []

        if (sessionId) {
            session = await KyvyaChat.findOne({
                sessionId,
                userId: user._id
            })

            if (session) {
                chatHistory = session.messages.slice(-10).map(msg => ({
                    role: msg.role === 'kyvya' ? 'assistant' : 'user',
                    content: msg.content
                }))
            }
        }

        // Get KYVYA response
        const response = await getKyvyaResponse({
            message,
            chatHistory,
            personality: user.kyvya.personalityMode,
            language: user.kyvya.language,
            context,
            subjectContext
        })

        if (!response.success) {
            throw new ApiError(503, response.content)
        }

        // Save to database
        const newSessionId = sessionId || uuidv4()

        if (session) {
            session.messages.push(
                { role: 'user', content: message, model: response.model },
                { role: 'kyvya', content: response.content, model: response.model }
            )
            await session.save()
        } else {
            session = await KyvyaChat.create({
                userId: user._id,
                sessionId: newSessionId,
                context,
                subjectContext,
                messages: [
                    { role: 'user', content: message, model: response.model },
                    { role: 'kyvya', content: response.content, model: response.model }
                ]
            })
        }

        return res.status(200).json(
            new ApiResponse(200, {
                sessionId: newSessionId,
                message: response.content,
                model: response.model,
                provider: response.provider,
                fallback: response.fallback || false
            }, 'KYVYA response received')
        )

    } catch (error) {
        next(error)
    }
}

// Get Chat History
const getChatHistory = async (req, res, next) => {
    try {
        const { sessionId } = req.params

        const session = await KyvyaChat.findOne({
            sessionId,
            userId: req.user._id
        })

        if (!session) {
            throw new ApiError(404, 'Session not found')
        }

        return res.status(200).json(
            new ApiResponse(200, session, 'Chat history fetched')
        )

    } catch (error) {
        next(error)
    }
}

// Get All Sessions
const getAllSessions = async (req, res, next) => {
    try {
        const sessions = await KyvyaChat.find(
            { userId: req.user._id },
            { sessionId: 1, context: 1, createdAt: 1, 'messages': { $slice: 1 } }
        ).sort({ createdAt: -1 })

        return res.status(200).json(
            new ApiResponse(200, sessions, 'Sessions fetched')
        )

    } catch (error) {
        next(error)
    }
}

// Delete Session
const deleteSession = async (req, res, next) => {
    try {
        const { sessionId } = req.params

        const session = await KyvyaChat.findOneAndDelete({
            sessionId,
            userId: req.user._id
        })

        if (!session) {
            throw new ApiError(404, 'Session not found')
        }

        return res.status(200).json(
            new ApiResponse(200, null, 'Session deleted successfully')
        )

    } catch (error) {
        next(error)
    }
}

// Semantic Search using Embeddings
const semanticSearch = async (req, res, next) => {
    try {
        const { query } = req.body

        if (!query) {
            throw new ApiError(400, 'Search query is required')
        }

        const result = await getEmbeddings([query], 'search_query')

        if (!result.success) {
            throw new ApiError(503, 'Search service unavailable')
        }

        return res.status(200).json(
            new ApiResponse(200, {
                embeddings: result.embeddings
            }, 'Embeddings generated')
        )

    } catch (error) {
        next(error)
    }
}

export {
    chat,
    getChatHistory,
    getAllSessions,
    deleteSession,
    semanticSearch
}