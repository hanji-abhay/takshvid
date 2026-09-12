import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8,
        select: false
    },
    avatar: {
        type: String,
        default: ''
    },
    academic: {
        stateId: { type: Number, default: null },
        universityId: { type: Number, default: null },
        courseId: { type: Number, default: null },
        semester: { type: Number, default: null }
    },
    kyvya: {
        personalityMode: {
            type: String,
            enum: ['bestie','nerd','guide','lover','hype','poetry'],
            default: 'bestie'
        },
        language: {
            type: String,
            enum: [
                'english',
                'hinglish',
                'hindi',
                'tamil',
                'telugu',
                'kannada',
                'malayalam',
                'bengali',
                'marathi',
                'gujarati',
                'punjabi',
                'odia',
                'assamese',
                'urdu',
                'sanskrit',
                'bhojpuri',
                'rajasthani',
                'chhattisgarhi',
                'dogri',
                'kashmiri',
                'manipuri',
            ],
            default: 'hinglish'
        },
        responseStyle: {
            type: String,
            enum: ['brief', 'medium', 'detailed'],
            default: 'medium'
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },

    verificationToken: {
        type: String,
        default: null,
        select: false
    },
    verificationExpiry: {
        type: Date,
        default: null,
        select: false
    },
    resetPasswordToken: {
        type: String,
        default: null,
        select: false
    },
    resetPasswordExpiry: {
        type: Date,
        default: null,
        select: false
    },
    refreshToken: {
        type: String,
        default: null,
        select: false
    }
}, { timestamps: true })

// Password hash before save
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password, 12)
})

// Password compare method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User