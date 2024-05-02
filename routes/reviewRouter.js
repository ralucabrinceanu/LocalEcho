import { Router } from 'express'
const router = Router()

import {
  createReview,
  deleteReview,
  getAllReviews,
} from '../controllers/reviewController.js'
import { validateReviewInput } from '../middleware/validation-middleware.js'

router.route('/').get(getAllReviews).post(validateReviewInput, createReview)
router.route('/:id').delete(deleteReview)

export default router
