import mongoose from 'mongoose'

const codeSubmissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    problemId: {
        type: Number,
        required: true
    },
    language: {
        type: String,
        required: true,
        enum: [
            'python',
            'javascript',
            'cpp',
            'java',
            'c',
            'typescript',
            'rust',
            'golang',
            'kotlin',
            'swift'
        ]
    },
    code: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: [
            'accepted',
            'wrong_answer',
            'time_limit_exceeded',
            'memory_limit_exceeded',
            'runtime_error',
            'compilation_error',
            'pending'
        ],
        default: 'pending'
    },
    runtime: {
        type: Number,
        default: null
    },
    memory: {
        type: Number,
        default: null
    },
    testCasesPassed: {
        type: Number,
        default: 0
    },
    totalTestCases: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const CodeSubmission = mongoose.model('CodeSubmission', codeSubmissionSchema)

export default CodeSubmission