import { Router } from 'express'
const router = Router()

import {
  getAllUsers,
  getCurrentUser,
  getApplicationStats,
  updateUser,
  updateUserRole,
} from '../controllers/userController.js'
import {
  validateUpdateUserInput,
  validateUserRoleInput,
} from '../middleware/validation-middleware.js'
import { authorizePermissions } from '../middleware/auth-middleware.js'
import upload from '../middleware/multer-middleware.js'

router.get('/all-users', authorizePermissions('ADMIN'), getAllUsers)
router.get('/current-user', getCurrentUser)
router.get('/admin/app-stats', [
  authorizePermissions('ADMIN'),
  getApplicationStats,
])
router.patch(
  '/update-user',
  upload.single('avatar'),
  validateUpdateUserInput,
  updateUser
)
router.patch(
  '/update-user-role',
  authorizePermissions('ADMIN'),
  validateUserRoleInput,
  updateUserRole
)

export default router
