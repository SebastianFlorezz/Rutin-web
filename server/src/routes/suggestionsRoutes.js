const express = require('express')
const router = express.Router()

// Protected route: return generic suggestions for the authenticated user
router.get('/', (req, res) => {
  // req.user is set by the authenticateJWT middleware in the parent route mounting
  const userId = req.user && req.user.id
  // Simple heuristic: different suggestions depending on user presence
  const suggestions = []
  if (userId) {
    suggestions.push(
      { id: 1, text: 'Review today’s agenda and mark top 3 tasks as priority' },
      { id: 2, text: 'Create a recurring reminder for daily stand-up' }
    )
  } else {
    suggestions.push({ id: 1, text: 'Sign up to get personalized task recommendations' })
  }
  res.json({ suggestions, count: suggestions.length })
})

module.exports = router
