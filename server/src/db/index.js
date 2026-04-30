// Simple in-memory DB for demonstration. Persists during runtime only.
const jwt = require('jsonwebtoken')

let users = []
let nextId = 1

function signToken(payload) {
  const secret = process.env.JWT_SECRET || 'dev'
  return jwt.sign(payload, secret, { expiresIn: '1h' })
}

function createUser({ email, name, passwordHash, googleId }) {
  const user = {
    id: nextId++,
    email: email || null,
    name: name || null,
    passwordHash: passwordHash || null,
    googleId: googleId || null,
    createdAt: new Date()
  }
  users.push(user)
  return user
}

function findUserByEmail() {
  return users.find((u) => u.email === email)
}

function findUserByGoogleId(googleId) {
  return users.find((u) => u.googleId === googleId)
}

function findUserById(id) {
  return users.find((u) => u.id === id)
}

function updateUser(id, updates) {
  const user = findUserById(id)
  if (!user) return null
  Object.assign(user, updates)
  return user
}

function initDemoSeed() {
  // Optional: seed a demo user for testing signup/login
  if (!users.length) {
    createUser({ email: 'demo@example.com', name: 'Demo User', passwordHash: '$2a$10$7QeVh8uPq6x6kG8nYd0G8u5lW7wQ5FZfVQ5lK6z8nKk4oD6y9pQK' })
  }
}

module.exports = {
  initDemoSeed,
  signToken,
  createUser,
  findUserByEmail,
  findUserByGoogleId,
  findUserById,
  updateUser
}
