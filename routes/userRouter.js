import { Router } from 'express'
const router = Router()

import {
  getCurrentUser,
  getApplicationStats,
  updateUser,
} from '../controllers/userController.js'
import { validateUpdateUserInput } from '../middleware/validation-middleware.js'
import { authorizePermissions } from '../middleware/auth-middleware.js'

router.get('/current-user', getCurrentUser)
router.get('/admin/app-stats', [
  authorizePermissions('ADMIN'),
  getApplicationStats,
])
router.patch('/update-user', validateUpdateUserInput, updateUser)

export default router
