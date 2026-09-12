import mongoose from 'mongoose'

const kyvyaChatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    context: {
        type: String,
        enum: ['study', 'code', 'research', 'general', 'skill'],
        default: 'general'
    },
    subjectId: {
        type: Number,
        default: null
    },
    messages: [{
        role: {
            type: String,
            enum: ['user', 'kyvya'],
            required: true
        },
        content: {
            type: String,
            required: true
        },
        model: {
            type: String,
            enum: [
                'gemini',
                'groq',
                'cohere',
                'openrouter'
            ],
            default: 'openai'
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true })

const KyvyaChat = mongoose.model('KyvyaChat', kyvyaChatSchema)

export default KyvyaChat