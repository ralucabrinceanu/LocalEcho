import { Router } from 'express'
const router = Router()

import rateLimiter from 'express-rate-limit'

import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
} from '../controllers/authController.js'
import {
  validateLoginInput,
  validateRegisterInput,
} from '../middleware/validation-middleware.js'
import { authenticateUser } from '../middleware/auth-middleware.js'

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  message: { msg: 'IP rate limit exceeded, retry in 15 minutes.' },
})

router.post('/register', validateRegisterInput, register)
router.post('/verify-email', verifyEmail)
router.post('/login', apiLimiter, validateLoginInput, login)
router.get('/logout', authenticateUser, logout)
router.post('/reset-password', resetPassword)
router.post('/forgot-password', forgotPassword)

export default router
