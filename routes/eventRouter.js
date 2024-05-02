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

router.route('/').get(getAllEvents).post(validateEventInput, createEvent)
router
  .route('/:id')
  .get(getEvent)
  .patch(validateEventInput, updateEvent)
  .delete(deleteEvent)

export default router
