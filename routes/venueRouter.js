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
import {
  authenticateUser,
  authorizePermissions,
} from '../middleware/auth-middleware.js'

router
  .route('/')
  .get(getAllVenues)
  .post(
    validateVenueInput,
    authenticateUser,
    authorizePermissions('ADMIN', 'EVENT_PLANNER'),
    createVenue
  )

router
  .route('/:id')
  .get(getVenue)
  .patch(
    validateVenueInput,
    authenticateUser,
    authorizePermissions('ADMIN'),
    updateVenue
  )
  .delete(authenticateUser, authorizePermissions('ADMIN'), deleteVenue)

export default router
