import mongoose from 'mongoose'

const userProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    studyProgress: [{
        subjectId: { type: Number },
        notesRead: [{ type: Number }],
        lastAccessed: { type: Date, default: Date.now }
    }],
    codingStreak: {
        current: { type: Number, default: 0 },
        longest: { type: Number, default: 0 },
        lastSolved: { type: Date, default: null },
        totalSolved: { type: Number, default: 0 }
    },
    skillProgress: [{
        skillId: { type: Number },
        completedModules: [{ type: Number }],
        percentage: { type: Number, default: 0 },
        startedAt: { type: Date, default: Date.now }
    }],
    badges: [{ type: String }],
    xp: { type: Number, default: 0 }
}, { timestamps: true })

const UserProgress = mongoose.model('UserProgress', userProgressSchema)

export default UserProgress