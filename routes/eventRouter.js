import { Router } from 'express'
const router = Router()

import {
  getAllEvents,
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  getUserEvents,
} from '../controllers/eventController.js'
import { validateEventInput } from '../middleware/validation-middleware.js'
import {
  authorizePermissions,
  authenticateUser,
} from '../middleware/auth-middleware.js'
import upload from '../middleware/multer-middleware.js'
import { getSingleEventReviews } from '../controllers/reviewController.js'
import { getSingleEventTicket } from '../controllers/ticketController.js'

router
  .route('/')
  .get(getAllEvents)
  .post(
    upload.single('image'),
    authenticateUser,
    authorizePermissions('ADMIN', 'EVENT_PLANNER'),
    validateEventInput,
    createEvent
  )

router.route('/user-events').get(authenticateUser, getUserEvents)

router
  .route('/:id')
  .get(getEvent)
  .patch(
    upload.single('image'),
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
router.route('/:id/tickets').get(getSingleEventTicket)

export default router
