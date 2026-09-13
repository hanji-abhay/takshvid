import { ApiResponse, ApiError } from '../utils/apiResponse.js'
import CodeSubmission from '../models/CodeSubmission.js'
import UserProgress from '../models/UserProgress.js'

const JUDGE0_URL = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com'
const JUDGE0_KEY = process.env.JUDGE0_API_KEY

// Language IDs for Judge0
const LANGUAGE_IDS = {
    python: 71,
    javascript: 63,
    cpp: 54,
    java: 62,
    c: 50,
    typescript: 74,
    rust: 73,
    golang: 60,
    kotlin: 78,
    swift: 83
}

// Submit Code
const submitCode = async (req, res, next) => {
    try {
        const { code, language, problemId, stdin = '' } = req.body

        if (!code || !language) {
            throw new ApiError(400, 'Code and language are required')
        }

        if (!LANGUAGE_IDS[language]) {
            throw new ApiError(400, 'Unsupported language')
        }

        // Submit to Judge0
        const submission = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': JUDGE0_KEY,
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
            body: JSON.stringify({
                source_code: code,
                language_id: LANGUAGE_IDS[language],
                stdin
            })
        })

        const result = await submission.json()

        // Map Judge0 status
        const statusMap = {
            3: 'accepted',
            4: 'wrong_answer',
            5: 'time_limit_exceeded',
            6: 'compilation_error',
            7: 'runtime_error',
            8: 'runtime_error',
            9: 'runtime_error',
            10: 'runtime_error',
            11: 'runtime_error',
            12: 'memory_limit_exceeded'
        }

        const status = statusMap[result.status?.id] || 'runtime_error'

        // Save submission
        const savedSubmission = await CodeSubmission.create({
            userId: req.user._id,
            problemId: problemId || 0,
            language,
            code,
            status,
            runtime: result.time ? parseFloat(result.time) * 1000 : null,
            memory: result.memory || null
        })

        // Update coding streak if accepted
        if (status === 'accepted') {
            await updateCodingStreak(req.user._id)
        }

        return res.status(200).json(
            new ApiResponse(200, {
                submissionId: savedSubmission._id,
                status,
                stdout: result.stdout,
                stderr: result.stderr,
                compile_output: result.compile_output,
                runtime: result.time,
                memory: result.memory
            }, 'Code submitted successfully')
        )

    } catch (error) {
        next(error)
    }
}

// Run Code — no problem, just execute
const runCode = async (req, res, next) => {
    try {
        const { code, language, stdin = '' } = req.body

        if (!code || !language) {
            throw new ApiError(400, 'Code and language are required')
        }

        if (!LANGUAGE_IDS[language]) {
            throw new ApiError(400, 'Unsupported language')
        }

        const submission = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': JUDGE0_KEY,
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
            body: JSON.stringify({
                source_code: code,
                language_id: LANGUAGE_IDS[language],
                stdin
            })
        })

        const result = await submission.json()

        return res.status(200).json(
            new ApiResponse(200, {
                stdout: result.stdout,
                stderr: result.stderr,
                compile_output: result.compile_output,
                runtime: result.time,
                memory: result.memory,
                status: result.status?.description
            }, 'Code executed successfully')
        )

    } catch (error) {
        next(error)
    }
}

// Get Submissions
const getSubmissions = async (req, res, next) => {
    try {
        const submissions = await CodeSubmission.find({
            userId: req.user._id
        }).sort({ createdAt: -1 }).limit(20)

        return res.status(200).json(
            new ApiResponse(200, submissions, 'Submissions fetched')
        )

    } catch (error) {
        next(error)
    }
}

// Update Coding Streak helper
const updateCodingStreak = async (userId) => {
    const progress = await UserProgress.findOne({ userId })
    if (!progress) return

    const today = new Date()
    const lastSolved = progress.codingStreak.lastSolved

    if (lastSolved) {
        const diffDays = Math.floor(
            (today - lastSolved) / (1000 * 60 * 60 * 24)
        )

        if (diffDays === 1) {
            progress.codingStreak.current += 1
        } else if (diffDays > 1) {
            progress.codingStreak.current = 1
        }
    } else {
        progress.codingStreak.current = 1
    }

    if (progress.codingStreak.current > progress.codingStreak.longest) {
        progress.codingStreak.longest = progress.codingStreak.current
    }

    progress.codingStreak.lastSolved = today
    progress.codingStreak.totalSolved += 1
    progress.xp += 10

    await progress.save()
}

export { submitCode, runCode, getSubmissions }