import { Router } from 'express'
const router = Router()

import {
  createRating,
  deleteRating,
  getAllRatings,
} from '../controllers/ratingController.js'
import { validateRatingInput } from '../middleware/validation-middleware.js'

router.route('/').get(getAllRatings).post(validateRatingInput, createRating)
router.route('/:ratingId').delete(deleteRating)

export default router
