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

router.get(
  '/all-users',
  // authenticateUser,
  // authorizePermissions('ADMIN'),
  getAllUsers
)
router.get('/current-user', authenticateUser, getCurrentUser) // authenticate
// router.get('/admin/app-stats', authenticateUser, [
//   authorizePermissions('ADMIN'),
//   getApplicationStats,
// ])

router.get('/admin/app-stats', getApplicationStats)

router.patch(
  '/update-user',
  authenticateUser,
  upload.single('avatar'),
  validateUpdateUserInput,
  updateUser
)
router.patch('/updateUserPassword', authenticateUser, updateUserPassword)
router.patch(
  '/update-user-role',
  authenticateUser,
  authorizePermissions('ADMIN'),
  validateUserRoleInput,
  updateUserRole
)
router.delete('/delete-user/:id', deleteUser) // authenticateUser

export default router

//TODO: verifica rutele !!!
