import { Router } from 'express'
const router = Router()

import {
  getAllEvents,
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  showStats,
} from '../controllers/eventController.js'
import { getSingleEventReviews } from '../controllers/reviewController.js'
import { validateEventInput } from '../middleware/validation-middleware.js'
import {
  authorizePermissions,
  authenticateUser,
} from '../middleware/auth-middleware.js'

router
  .route('/')
  .get(getAllEvents)
  .post(
    validateEventInput,
    authenticateUser,
    authorizePermissions('ADMIN', 'EVENT_PLANNER'),
    createEvent
  )

router.route('/stats').get(showStats)

router
  .route('/:id')
  .get(getEvent)
  .patch(
    validateEventInput,
    authenticateUser,
    authorizePermissions('ADMIN', 'EVENT_PLANNER'),
    updateEvent
  )
  .delete(
    authenticateUser,
    authorizePermissions('ADMIN', 'EVENT_PLANNER'),
    deleteEvent
  )

router.route('/:id/reviews').get(getSingleEventReviews)

export default router
