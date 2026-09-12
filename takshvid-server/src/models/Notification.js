import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: [
            'welcome',
            'email_verified',
            'streak_achieved',
            'badge_earned',
            'new_notes',
            'new_pyqs',
            'skill_completed',
            'problem_solved',
            'system'
        ],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    link: {
        type: String,
        default: null
    }
}, { timestamps: true })

const Notification = mongoose.model('Notification', notificationSchema)

export default Notification