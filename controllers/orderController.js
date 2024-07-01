import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError } from '../errors/customErrors.js'
import { PrismaClient } from '@prisma/client'
import { checkPermissions } from '../utils/checkPermissions.js'
import stripePackage from 'stripe'

const prisma = new PrismaClient()
// const stripe = new Stripe(
//   'sk_test_51PLsLUGw9aMG63Jk72mmdYclbQrA6qlo9oTHloWm1SgQUBWKMYodhAiwpLdIXXWaAC3lt949WEKuHRJZ1RWWrW4e00GcJYlqet'
// )
const stripe = stripePackage(process.env.STRIPE_KEY)

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
  const { search } = req.query
  const queryObject = {}
  // PAGINATION
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 2
  const skip = (page - 1) * limit

  const orders = await prisma.orders.findMany({
    where: { orderedById: req.user.userId },
    take: limit,
    skip: skip,
  })

  const totalOrders = await prisma.orders.count({
    where: { AND: [{ orderedById: req.user.userId }, queryObject] },
  })
  const numOfPages = Math.ceil(totalOrders / limit)

  res.status(StatusCodes.OK).json({
    meta: {
      pagination: { totalOrders, numOfPages, currentPage: page },
    },
    orders,
  })
}

export const createOrder = async (req, res) => {
  const { items: cartItems } = req.body
  // console.log('CART ITEMS', cartItems)

  if (!cartItems || cartItems.length < 1)
    throw new BadRequestError('No cart items provided')

  let orderItems = []
  let subtotal = 0

  for (const item of cartItems) {
    // console.log('PROCESSING TICKET ID: ', item.ticketId)
    const dbTicket = await prisma.tickets.findUnique({
      where: { id: item.ticketId },
    })
    // console.log('TICKET', dbTicket)
    if (!dbTicket) throw new NotFoundError(`No ticket with id ${item.ticketId}`)

    if (item.amount > dbTicket.ticketsAvailable) {
      throw new BadRequestError(`Not enough tickets available...`)
    }

    const { id, price } = dbTicket
    const singleOrderItem = {
      amount: item.amount,
      price,
      ticketId: id,
    }

    orderItems = [...orderItems, singleOrderItem]
    subtotal += item.amount * price
  }
  const total = subtotal

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: 'ron',
    automatic_payment_methods: {
      enabled: true,
    },
  })

  const order = await prisma.orders.create({
    data: {
      total,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
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
  console.log(paymentIntent.status)

  const orderWithItems = {
    ...order,
    orderItems: orderItems,
  }

  res.status(StatusCodes.CREATED).json({
    order: orderWithItems,
    clientSecret: order.clientSecret,
    paymentIntentId: order.paymentIntentId,
  })
}

// export const updateOrder = async (req, res) => {
//   const { id } = req.params
//   const { paymentIntentId } = req.body

//   const order = await prisma.orders.findUnique({ where: { id } })
//   if (!order) throw new NotFoundError(`No order with id ${id}`)
//   //   console.log('ORDER', order)

//   checkPermissions(req.user, order.orderedById)

//   const updatedOrder = await prisma.orders.update({
//     where: { id },
//     data: { paymentIntentId, status: 'PAID' },
//   })

//   res.status(StatusCodes.OK).json({ order: updatedOrder })
// }
