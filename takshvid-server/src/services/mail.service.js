import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})

const sendVerificationEmail = async (email, name, token) => {
    try {
        const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`

        await transporter.sendMail({
            from: `"TAKSHVID" <${process.env.MAIL_USER}>`,
            to: email,
            subject: 'Verify your TAKSHVID account',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #E8A020;">Welcome to TAKSHVID</h1>
                    <p>Hey ${name},</p>
                    <p>Your journey begins here. Verify your email to access TAKSHVID.</p>
                    <a href="${verificationUrl}" 
                       style="background: #E8A020; color: white; 
                              padding: 12px 24px; text-decoration: none; 
                              border-radius: 6px; display: inline-block;">
                        Verify Email
                    </a>
                    <p style="color: #666; margin-top: 20px;">
                        Link expires in 24 hours.
                    </p>
                </div>
            `
        })

        return { success: true }

    } catch (error) {
        console.error(`Mail Error: ${error.message}`)
        return { success: false, error: error.message }
    }
}

const sendPasswordResetEmail = async (email, name, token) => {
    try {
        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`

        await transporter.sendMail({
            from: `"TAKSHVID" <${process.env.MAIL_USER}>`,
            to: email,
            subject: 'Reset your TAKSHVID password',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #E8A020;">Password Reset</h1>
                    <p>Hey ${name},</p>
                    <p>Someone requested a password reset for your account.</p>
                    <a href="${resetUrl}" 
                       style="background: #E8A020; color: white; 
                              padding: 12px 24px; text-decoration: none; 
                              border-radius: 6px; display: inline-block;">
                        Reset Password
                    </a>
                    <p style="color: #666; margin-top: 20px;">
                        If you didn't request this, ignore this email.
                        Link expires in 1 hour.
                    </p>
                </div>
            `
        })

        return { success: true }

    } catch (error) {
        console.error(`Mail Error: ${error.message}`)
        return { success: false, error: error.message }
    }
}

export { sendVerificationEmail, sendPasswordResetEmail }