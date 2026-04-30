const express = require('express')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const authController = require('../controllers/authController')
const db = require('../db')

const router = express.Router()

// Local authentication
router.post('/signup', authController.signup)
router.post('/login', authController.login)

// Google OAuth2
router.get('/google/login', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  // On successful authentication, issue a JWT and redirect to frontend with token
  const user = req.user
  const token = db.signToken({ id: user.id, email: user.email })
  const frontend = process.env.FRONTEND_URL || 'http://localhost:3000'
  res.redirect(`${frontend}/login-success?token=${token}`)
})

module.exports = router
