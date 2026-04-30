// Basic User model placeholder (for clarity in the project's structure)
class User {
  constructor({ id, email, name, googleId, createdAt }) {
    this.id = id
    this.email = email
    this.name = name
    this.googleId = googleId || null
    this.createdAt = createdAt || new Date()
  }
}

module.exports = User
