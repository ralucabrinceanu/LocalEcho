import { Router } from 'express'
const router = Router()

import {
  getAllVenues,
  getVenue,
  createVenue,
  updateVenue,
  deleteVenue,
} from '../controllers/venueController.js'
import { validateVenueInput } from '../middleware/validation-middleware.js'

router.route('/').get(getAllVenues).post(validateVenueInput, createVenue)
router
  .route('/:id')
  .get(getVenue)
  .patch(validateVenueInput, updateVenue)
  .delete(deleteVenue)

export default router
