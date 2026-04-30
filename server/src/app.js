require('dotenv').config()
const express = require('express')
const passport = require('passport')
const session = require('express-session')
const GoogleStrategy = require('passport-google-oauth20').Strategy

const db = require('./db')
db.initDemoSeed()
const authRoutes = require('./routes/authRoutes')
const suggestionsRoutes = require('./routes/suggestionsRoutes')
const { authenticateJWT } = require('./middlewares/auth')

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(corsMiddleware())

// Optional session support for Passport (Google OAuth2 UI flow)
app.use(session({ secret: process.env.SESSION_SECRET || 'session_secret', resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())

// Passport Google OAuth2 configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'GOOGLE_CLIENT_ID',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'GOOGLE_CLIENT_SECRET',
      callbackURL: 'http://localhost:3000/api/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      // Find or create user by Google profile.id
      let user = db.findUserByGoogleId(profile.id)
      if (!user) {
        const email = profile.emails && profile.emails[0] && profile.emails[0].value
        user = db.createUser({ email, name: profile.displayName, googleId: profile.id })
      }
      return done(null, user)
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser((id, done) => {
  const user = db.findUserById(id)
  done(null, user)
})

// Mount routes
app.use('/api/auth', authRoutes)
app.use('/api/suggestions', authenticateJWT, suggestionsRoutes)

// Simple root
app.get('/', (req, res) => res.json({ ok: true, message: 'Rutin API' }))

app.listen(PORT, () => {
  console.log(`Rutin API listening on port ${PORT}`)
})

function corsMiddleware() {
  return (req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*')
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if (req.method === 'OPTIONS') return res.sendStatus(204)
    next()
  }
}