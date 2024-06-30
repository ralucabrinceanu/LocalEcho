import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError } from '../errors/customErrors.js'
import { PrismaClient, TicketType } from '@prisma/client'
const prisma = new PrismaClient()

export const getAllTickets = async (req, res) => {
  const tickets = await prisma.tickets.findMany()
  res.status(StatusCodes.OK).json({ tickets, count: tickets.length })
}

export const getSingleEventTicket = async (req, res) => {
  const { id: eventId } = req.params

  const event = await prisma.events.findUnique({ where: { id: eventId } })
  if (!event) throw new NotFoundError(`No event with id ${eventId}`)

  const tickets = await prisma.tickets.findMany({
    where: { eventId },
  })

  res.status(StatusCodes.OK).json({ tickets, count: tickets.length })
}

export const getSingleTicket = async (req, res) => {
  const { id: ticketId } = req.params

  const eventTicket = await prisma.tickets.findUnique({
    where: { id: ticketId },
    include: {
      event: true,
    },
  })
  console.log(eventTicket.event)
  const response = eventTicket.event

  res.status(StatusCodes.OK).json({ response })
}

export const createTicket = async (req, res) => {
  const { ticketType, ticketsAvailable, price } = req.body
  const { id: eventId } = req.params
  req.body.createdById = req.user.userId

  const event = await prisma.events.findUnique({ where: { id: eventId } })
  if (!event) throw new NotFoundError(`No event with id ${id}`)
  console.log('EVENT: ', event)

  const existingTicket = await prisma.tickets.findFirst({
    where: {
      eventId: eventId,
      ticketType: ticketType,
    },
  })

  let ticket
  if (existingTicket) {
    if (existingTicket.price !== price) {
      throw new BadRequestError(
        `Price for ticket type ${ticketType} must be ${existingTicket.price}`
      )
    }

    ticket = await prisma.tickets.update({
      where: { id: existingTicket.id },
      data: {
        ticketsAvailable: existingTicket.ticketsAvailable + ticketsAvailable,
      },
    })
  } else {
    ticket = await prisma.tickets.create({
      data: {
        ticketType,
        ticketsAvailable,
        price,
        createdById: req.body.createdById,
        eventId: eventId,
      },
    })
  }

  res.status(StatusCodes.CREATED).json({ ticket })
}

export const updateTicket = async (req, res) => {
  const { id } = req.params
  const { ticketType, ticketsAvailable, price } = req.body

  const ticket = await prisma.tickets.findUnique({ where: { id } })
  if (!ticket) throw new NotFoundError(`No ticket with id ${id}`)

  const updatedTicket = await prisma.tickets.update({
    where: { id },
    data: { ticketType, ticketsAvailable, price },
  })

  res
    .status(StatusCodes.OK)
    .json({ msg: 'Ticket modified', ticket: updatedTicket })
}

export const deleteTicket = async (req, res) => {
  const { id } = req.params

  const ticket = await prisma.tickets.findUnique({ where: { id } })
  if (!ticket) throw new NotFoundError(`No ticket with id ${id}`)
  const deletedTicket = await prisma.tickets.delete({ where: { id } })

  res
    .status(StatusCodes.OK)
    .json({ msg: 'Ticket deleted successfully', ticket: deletedTicket })
}
