import { Router } from 'express'
const router = Router()

import {
  createReview,
  getSingleReview,
  updateReview,
  deleteReview,
  getAllReviews,
} from '../controllers/reviewController.js'
import {
  validateReviewInput,
  validateReviewUpdateInput,
} from '../middleware/validation-middleware.js'
import {
  authenticateUser,
  authorizePermissions,
} from '../middleware/auth-middleware.js'

router
  .route('/')
  .get(getAllReviews)
  .post(authenticateUser, validateReviewInput, createReview)

router
  .route('/:id')
  .get(getSingleReview)
  .patch(authenticateUser, validateReviewUpdateInput, updateReview)
  .delete(authenticateUser, deleteReview)

export default router
