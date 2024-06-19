import { Router } from 'express'
const router = Router()

import {
  getAllTickets,
  createTicket,
  updateTicket,
  deleteTicket,
  getSingleEventTicket,
  getSingleTicket,
} from '../controllers/ticketController.js'
import {
  validateTicketInput,
  validateUpdateTicketInput,
} from '../middleware/validation-middleware.js'
import {
  authenticateUser,
  authorizePermissions,
} from '../middleware/auth-middleware.js'

router.route('/').get(getAllTickets)

router
  .route('/:id')
  // .get(getSingleEventTicket)
  .get(getSingleTicket)
  .post(
    authenticateUser,
    authorizePermissions('ADMIN', 'EVENT_PLANNER'),
    validateTicketInput,
    createTicket
  )
  .patch(
    authenticateUser,
    authorizePermissions('ADMIN', 'EVENT_PLANNER'),
    validateUpdateTicketInput,
    updateTicket
  )
  .delete(
    authenticateUser,
    authorizePermissions('ADMIN', 'EVENT_PLANNER'),
    deleteTicket
  )

export default router
