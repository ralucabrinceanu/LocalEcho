import { Router } from 'express'
const router = Router()
import {
  getAllUsers,
  getCurrentUser,
  getApplicationStats,
  updateUser,
  updateUserPassword,
  updateUserRole,
  deleteUser,
  getUser,
} from '../controllers/userController.js'
import {
  validateUpdateUserInput,
  validateUserRoleInput,
} from '../middleware/validation-middleware.js'
import {
  authenticateUser,
  authorizePermissions,
} from '../middleware/auth-middleware.js'
import upload from '../middleware/multer-middleware.js'

router.get('/all-users', getAllUsers)

router.get(
  '/single-user/:id',
  authenticateUser,
  authorizePermissions('ADMIN'),
  getUser
)

router.get('/current-user', authenticateUser, getCurrentUser)

router.get(
  '/admin/app-stats',
  authenticateUser,
  authorizePermissions('ADMIN'),
  getApplicationStats
)

router.patch(
  '/update-user',
  upload.single('avatar'),
  authenticateUser,
  validateUpdateUserInput,
  updateUser
)

router.patch('/updateUserPassword', updateUserPassword)

router.patch(
  '/update-user-role/:id',
  authenticateUser,
  authorizePermissions('ADMIN'),
  validateUserRoleInput,
  updateUserRole
)

router.delete('/delete-user/:id', deleteUser)

export default router
