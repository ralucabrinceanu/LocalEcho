import { StatusCodes } from 'http-status-codes'
import { NotFoundError } from '../errors/customErrors.js'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getAllEvents = async (req, res) => {
  const events = await prisma.events.findMany()
  res.status(StatusCodes.OK).json({ events })
}

export const createEvent = async (req, res) => {
  const { title, description, date } = req.body
  const event = await prisma.events.create({
    data: { title, description, date },
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
  const { title, description, date } = req.body
  const event = await prisma.events.findUnique({ where: { id } })
  if (!event) throw new NotFoundError(`No event with id ${id}`)
  const updatedEvent = await prisma.events.update({
    where: { id },
    data: { title, description, date },
  })
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Event modified', event: updatedEvent })
}

export const deleteEvent = async (req, res) => {
  const { id } = req.params
  const event = await prisma.events.findUnique({ where: { id } })
  if (!event) throw new NotFoundError(`No event with id ${id}`)
  const deletedEvent = await prisma.events.delete({ where: { id } })
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Event deleted successfully', event: deletedEvent })
}
