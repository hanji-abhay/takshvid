const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

const validatePassword = (password) => {
    // minimum 8 characters
    // at least one uppercase
    // at least one lowercase
    // at least one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    return passwordRegex.test(password)
}

const validateName = (name) => {
    return name && name.trim().length >= 2
}

export { validateEmail, validatePassword, validateName }