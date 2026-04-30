const bcrypt = require('bcryptjs')
const db = require('../db')
const jwt = require('jsonwebtoken')

async function signup(req, res) {
  const { email, password, name } = req.body
  // validations
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const existing = db.findUserByEmail(email)
  if (existing) {
    return res.status(400).json({ error: 'User already exists' })
  }

  // logic
  const hash = await bcrypt.hash(password, 10)
  const user = db.createUser({ email, name, passwordHash: hash })
  const token = db.signToken({ id: user.id, email: user.email })
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
}

async function login(req, res) {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }
  const user = db.findUserByEmail(email)
  if (!user || !user.passwordHash) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
  const token = db.signToken({ id: user.id, email: user.email })
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
}

module.exports = {
  signup,
  login
}
