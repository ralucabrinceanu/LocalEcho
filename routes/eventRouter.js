import { Router } from 'express'
const router = Router()

import {
  getAllEvents,
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js'
import { validateEventInput } from '../middleware/validation-middleware.js'
import { authorizePermissions } from '../middleware/auth-middleware.js'

router
  .route('/')
  .get(getAllEvents)
  .post(
    validateEventInput,
    authorizePermissions('ADMIN', 'EVENT_PLANNER'),
    createEvent
  )
router
  .route('/:id')
  .get(getEvent)
  .patch(
    validateEventInput,
    authorizePermissions('ADMIN', 'EVENT_PLANNER'),
    updateEvent
  )
  .delete(authorizePermissions('ADMIN', 'EVENT_PLANNER'), deleteEvent)

export default router
