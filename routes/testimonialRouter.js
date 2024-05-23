import { Router } from 'express'
const router = Router()

import {
  getAllTestimonials,
  createTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js'
import {
  authenticateUser,
  authorizePermissions,
} from '../middleware/auth-middleware.js'

router
  .route('/')
  .get(getAllTestimonials)
  .post(authenticateUser, createTestimonial)
router
  .route('/:id')
  .delete(authenticateUser, authorizePermissions('ADMIN'), deleteTestimonial)

export default router
