import { Router } from 'express'
const router = Router()

import {
  getAllOrders,
  createOrder,
  getSingleOrder,
  getCurrentUserOrders,
  updateOrder,
} from '../controllers/orderController.js'
import {
  authenticateUser,
  authorizePermissions,
} from '../middleware/auth-middleware.js'

router
  .route('/')
  .get(authenticateUser, authorizePermissions('ADMIN'), getAllOrders)
  .post(authenticateUser, createOrder)

router.route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrders)

router
  .route('/:id')
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder)

export default router
