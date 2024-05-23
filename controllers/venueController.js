import { StatusCodes } from 'http-status-codes'
import { NotFoundError } from '../errors/customErrors.js'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getAllVenues = async (req, res) => {
  const venues = await prisma.venues.findMany()
  res.status(StatusCodes.OK).json({ venues })
}

export const createVenue = async (req, res) => {
  const { name, address, capacity, city, zipCode } = req.body
  // console.log(req.user)
  req.body.createdById = req.user.userId

  const venue = await prisma.venues.create({
    data: {
      name,
      address,
      capacity,
      city,
      zipCode,
      createdById: req.body.createdById,
    },
  })
  res.status(StatusCodes.CREATED).json({ venue })
}

export const getVenue = async (req, res) => {
  const { id } = req.params
  const venue = await prisma.venues.findUnique({ where: { id } })
  if (!venue) {
    throw new NotFoundError(`No venue with id ${id}`)
  }
  res.status(StatusCodes.OK).json({ venue })
}

export const updateVenue = async (req, res) => {
  const { id } = req.params
  const { name, address, capacity, city, zipCode } = req.body

  const venue = await prisma.venues.findUnique({ where: { id } })
  if (!venue) throw new NotFoundError(`No venue with id ${id}`)

  const updatedVenue = await prisma.venues.update({
    where: { id },
    data: { name, address, capacity, city, zipCode },
  })

  res
    .status(StatusCodes.OK)
    .json({ msg: 'Venue modified', venue: updatedVenue })
}

export const deleteVenue = async (req, res) => {
  const { id } = req.params
  const venue = await prisma.venues.findUnique({ where: { id } })
  if (!venue) throw new NotFoundError(`No venue with id ${id}`)

  const deletedVenue = await prisma.venues.delete({ where: { id } })
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Venue deleted successfully', venue: deletedVenue })
}
