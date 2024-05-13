import { Router } from 'express'
const router = Router()

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

router.post('/register', validateRegisterInput, register)
router.post('/verify-email', verifyEmail)
router.post('/login', validateLoginInput, login)
router.get('/logout', authenticateUser, logout)
router.post('/reset-password', resetPassword)
router.post('/forgot-password', forgotPassword)

export default router
