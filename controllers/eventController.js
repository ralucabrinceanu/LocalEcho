import { StatusCodes } from 'http-status-codes'
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../errors/customErrors.js'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getAllEvents = async (req, res) => {
  // console.log(req.user)
  const events = await prisma.events.findMany()
  res.status(StatusCodes.OK).json({ events })
}

export const createEvent = async (req, res) => {
  const { title, description, date, venueId, eventStatus, eventCategory } =
    req.body
  // console.log(req.user)
  req.body.createdById = req.user.userId

  const venue = await prisma.venues.findUnique({ where: { id: venueId } })
  if (!venue) throw new NotFoundError(`No venue with id ${venueId}`)
  const venueIdDb = venue.id

  const event = await prisma.events.create({
    data: {
      title,
      description,
      date,
      venueId: venueIdDb,
      eventStatus,
      eventCategory,
      createdById: req.body.createdById,
    },
  })
  res.status(StatusCodes.CREATED).json({ event })
}

export const getEvent = async (req, res) => {
  const { id } = req.params
  const event = await prisma.events.findUnique({ where: { id } })
  if (!event) throw new NotFoundError(`No event with id ${id}`)
  res.status(StatusCodes.OK).json({ event })
}

export const updateEvent = async (req, res) => {
  const { id } = req.params
  const { title, description, date, venueId, eventStatus, eventCategory } =
    req.body

  const venue = await prisma.venues.findUnique({ where: { id: venueId } })
  if (!venue) throw new NotFoundError(`No venue with id ${venueId}`)
  const venueIdDb = venue.id

  const event = await prisma.events.findUnique({ where: { id } })
  if (!event) throw new NotFoundError(`No event with id ${id}`)

  if (event.createdById !== req.user.userId && req.user.role[0] != 'ADMIN')
    throw new UnauthorizedError('Not authorized to update this event')

  const updatedEvent = await prisma.events.update({
    where: { id },
    data: {
      title,
      description,
      date,
      venueId: venueIdDb,
      eventStatus,
      eventCategory,
    },
  })
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Event modified', event: updatedEvent })
}

export const deleteEvent = async (req, res) => {
  const { id } = req.params

  const event = await prisma.events.findUnique({
    where: { id },
  })
  if (!event) throw new NotFoundError(`No event with id ${id}`)

  if (event.createdById !== req.user.userId && req.user.role[0] != 'ADMIN')
    throw new UnauthorizedError('Not authorized to delete this event')

  const deletedEvent = await prisma.events.delete({ where: { id } })
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Event deleted successfully', event: deletedEvent })
}
