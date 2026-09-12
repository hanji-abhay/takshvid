import Groq from 'groq-sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { CohereClient } from 'cohere-ai'

// Initialize clients
const groq = new Groq({
apiKey: process.env.GROQ_API_KEY
})

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const cohere = new CohereClient({
token: process.env.COHERE_API_KEY
})

// Personality System Prompts
const buildSystemPrompt = ({ personality, language, context, subjectContext }) => {

const personalities = {
    bestie: `You are KYVYA, a friendly Gen-Z study buddy.
             Talk casually, use simple words, and be warm and encouraging.
             Never make the student feel dumb.`,

    nerd: `You are KYVYA, a knowledgeable academic assistant.
           Give detailed, well-structured, and accurate responses.
           Use proper terminology and explain concepts thoroughly.`,

    guide: `You are KYVYA, a wise mentor.
            Push the student to think deeper.
            Ask questions when appropriate and challenge their understanding.
            Encourage independent thinking.`,

    lover: `You are KYVYA, a warm and supportive companion.
            Adapt naturally to the relationship role requested by the user.
            Be gentle, patient, and encouraging.
            Break difficult things down simply.`,

    hype: `You are KYVYA, an energetic Gen-Z hype assistant.
           Be fast, sharp, and motivating.
           No unnecessary fluff, just clear answers with energy.
           Celebrate progress and keep the student moving forward.`,

    poetry: `You are KYVYA, a creative and poetic guide.
             Explain concepts through metaphors, stories, and analogies.
             Make learning memorable without sacrificing accuracy.`
}

const languages = {
    hindi: 'Always respond in Hindi using Devanagari script.',
    english: 'Always respond in English.',
    hinglish: 'Always respond in natural Hinglish using Roman script.',
    tamil: 'Always respond in Tamil.',
    telugu: 'Always respond in Telugu.',
    kannada: 'Always respond in Kannada.',
    malayalam: 'Always respond in Malayalam.',
    bengali: 'Always respond in Bengali.',
    marathi: 'Always respond in Marathi.',
    gujarati: 'Always respond in Gujarati.',
    punjabi: 'Always respond in Punjabi.',
    odia: 'Always respond in Odia.',
    assamese: 'Always respond in Assamese.',
    urdu: 'Always respond in Urdu.',
    sanskrit: 'Always respond in Sanskrit.',
    bhojpuri: 'Always respond in Bhojpuri.',
    rajasthani: 'Always respond in Rajasthani.',
    chhattisgarhi: 'Always respond in Chhattisgarhi.',
    dogri: 'Always respond in Dogri.',
    kashmiri: 'Always respond in Kashmiri.',
    manipuri: 'Always respond in Manipuri.'
}

return `${personalities[personality] || personalities.bestie}
        ${languages[language] || languages.hinglish}
        ${context ? `Current context: ${context}` : ''}
        ${subjectContext ? `Subject being studied: ${subjectContext}` : ''}
        You are embedded in TAKSHVID, an EdTech platform for Indian university students.
        Always be helpful, accurate, and supportive.
        Never invent facts, sources, or citations.`
}

// Route to best model based on context
const selectModel = (context) => {
switch(context) {
case 'code':
return {
provider: 'openrouter',
model: process.env.OPENROUTER_CODE_MODEL || 'deepseek/deepseek-r1:free'
}

case 'research':
return {
    provider: 'gemini',
    model: process.env.GEMINI_RESEARCH_MODEL || 'gemini-1.5-flash'
}

default:
return {
    provider: 'groq',
    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'
}
}
}

// Groq call
const callGroq = async (systemPrompt, messages, model) => {
const response = await groq.chat.completions.create({
model,
messages: [
{ role: 'system', content: systemPrompt },
...messages.map(msg => ({
role: msg.role === 'kyvya' || msg.role === 'assistant'
? 'assistant'
: 'user',
content: msg.content
}))
],
temperature: 0.7,
max_tokens: 1024
})

const content = response.choices?.[0]?.message?.content

if (!content) {
    throw new Error('Groq returned an empty response')
}

return {
    content,
    provider: 'groq',
    model
}}

// Gemini call
const callGemini = async (systemPrompt, messages, model) => {
const geminiModel = gemini.getGenerativeModel({
model,
systemInstruction: systemPrompt
})

const chat = geminiModel.startChat({
    history: messages
        .slice(0, -1)
        .filter(msg => ['user', 'kyvya', 'assistant'].includes(msg.role))
        .map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }))
})

const lastMessage = messages[messages.length - 1]
const response = await chat.sendMessage(lastMessage.content)

const content = response.response.text()

if (!content) {
    throw new Error('Gemini returned an empty response')
}

return {
    content,
    provider: 'gemini',
    model
}
}

// OpenRouter call
const callOpenRouter = async (systemPrompt, messages, model) => {
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
method: 'POST',
headers: {
'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
'Content-Type': 'application/json'
},
body: JSON.stringify({
model,
messages: [
{ role: 'system', content: systemPrompt },
...messages.map(msg => ({
role: msg.role === 'kyvya' ? 'assistant' : msg.role,
content: msg.content
}))
],
temperature: 0.7,
max_tokens: 1024
})
})

const data = await response.json()

if (!response.ok) {
    throw new Error(
        data?.error?.message ||
        `OpenRouter request failed with status ${response.status}`
    )
}

const content = data?.choices?.[0]?.message?.content

if (!content) {
    throw new Error('OpenRouter returned an empty response')
}

return {
    content,
    provider: 'openrouter',
    model
}
}

// Main KYVYA function
const getKyvyaResponse = async ({
message,
chatHistory = [],
personality = 'bestie',
language = 'hinglish',
context = 'general',
subjectContext = null
}) => {
const systemPrompt = buildSystemPrompt({
personality,
language,
context,
subjectContext
})

const messages = [
    ...chatHistory.slice(-10),
    { role: 'user', content: message }
]

try {
    const { provider, model } = selectModel(context)

    let response

    switch(provider) {
        case 'gemini':
            response = await callGemini(systemPrompt, messages, model)
            break

        case 'openrouter':
            response = await callOpenRouter(systemPrompt, messages, model)
            break

        default:
            response = await callGroq(systemPrompt, messages, model)
    }

    return {
        success: true,
        content: response.content,
        provider: response.provider,
        model: response.model
    }

} catch (error) {
    console.error(`KYVYA Error: ${error.message}`)

    try {
        const fallbackModel =
            process.env.GROQ_FALLBACK_MODEL ||
            'llama-3.1-8b-instant'

        const response = await callGroq(
            systemPrompt,
            messages,
            fallbackModel
        )

        return {
            success: true,
            content: response.content,
            provider: response.provider,
            model: response.model,
            fallback: true
        }

    } catch (fallbackError) {
        console.error(`KYVYA Fallback Error: ${fallbackError.message}`)

        return {
            success: false,
            content: 'KYVYA is taking a short break. Please try again in a moment.',
            provider: null,
            model: null
        }
    }
}

}

// Embeddings for semantic search
const getEmbeddings = async (texts, inputType = 'search_document') => {
try {
if (!Array.isArray(texts)) {
texts = [texts]
}

    const response = await cohere.embed({
        texts,
        model: process.env.COHERE_EMBEDDING_MODEL || 'embed-multilingual-v3.0',
        inputType
    })

    return {
        success: true,
        embeddings: response.embeddings
    }
} catch (error) {
    return {
        success: false,
        error: error.message
    }
}

}

export { getKyvyaResponse, getEmbeddings }
