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
  // if (!name || !address || !capacity || !city) {
  //   return res
  //     .status(400)
  //     .json({ msg: 'Please provide name, address, capacity and city!' })
  // }
  const venue = await prisma.venues.create({
    data: { name, address, capacity, city, zipCode },
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
  // if (!name || !address || !capacity || !city) {
  //   return res
  //     .status(400)
  //     .json({ msg: 'Please provide name, address, capacity and city!' })
  // }
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