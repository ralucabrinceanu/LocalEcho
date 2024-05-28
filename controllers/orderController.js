import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError } from '../errors/customErrors.js'
import { PrismaClient } from '@prisma/client'
import { checkPermissions } from '../utils/checkPermissions.js'
const prisma = new PrismaClient()

export const getAllOrders = async (req, res) => {
  const orders = await prisma.orders.findMany()
  res.status(StatusCodes.OK).json({ orders, count: orders.length })
}

export const getSingleOrder = async (req, res) => {
  const { id } = req.params
  const order = await prisma.orders.findUnique({ where: { id } })
  if (!order) throw new NotFoundError(`No order with id ${id}`)

  res.status(StatusCodes.OK).json({ order })
}

export const getCurrentUserOrders = async (req, res) => {
  const orders = await prisma.orders.findMany({
    where: { orderedById: req.user.userId },
  })
  res.status(StatusCodes.OK).json({ orders, count: orders.length })
}

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = 'someRandomValue'
  return { client_secret, amount }
}

export const createOrder = async (req, res) => {
  const { items: cartItems } = req.body
  //   console.log('ITEM: ', cartItems)

  if (!cartItems || cartItems.length < 1)
    throw new BadRequestError('No cart items provided')

  let orderItems = []
  let subtotal = 0

  for (const item of cartItems) {
    // console.log('PROCESSING TICKET ID: ', item.ticketId)
    const dbTicket = await prisma.tickets.findUnique({
      where: { id: item.ticketId },
    })
    if (!dbTicket) throw new NotFoundError(`No ticket with id ${item.ticketId}`)

    const { id, price } = dbTicket
    // console.log(id, price)
    const singleOrderItem = {
      amount: item.amount,
      price,
      ticketId: id,
    }

    // add item to order
    orderItems = [...orderItems, singleOrderItem]
    // calculate subtotal
    subtotal += item.amount * price
  }
  //   console.log('ORDER ITEMS', orderItems)
  //   console.log('SUBTOTAL', subtotal)
  const total = subtotal

  //   get client secret
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: 'ron',
  })

  const order = await prisma.orders.create({
    data: {
      total,
      clientSecret: paymentIntent.client_secret,
      orderedById: req.user.userId,
      orderItems: {
        create: orderItems.map((item) => ({
          amount: item.amount,
          price: item.price,
          ticketId: item.ticketId,
        })),
      },
    },
  })

  const orderWithItems = {
    ...order,
    orderItems: orderItems,
  }
  res
    .status(StatusCodes.CREATED)
    .json({ order: orderWithItems, clientSecret: order.clientSecret })
}

export const updateOrder = async (req, res) => {
  const { id } = req.params
  const { paymentIntentId } = req.body

  const order = await prisma.orders.findUnique({ where: { id } })
  if (!order) throw new NotFoundError(`No order with id ${id}`)
  //   console.log('ORDER', order)

  checkPermissions(req.user, order.orderedById)

  const updatedOrder = await prisma.orders.update({
    where: { id },
    data: { paymentIntentId, status: 'PAID' },
  })

  res.status(StatusCodes.OK).json({ order: updatedOrder })
}
