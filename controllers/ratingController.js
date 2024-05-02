import { PrismaClient } from '@prisma/client'
import { NotFoundError } from '../errors/customErrors.js'
import { StatusCodes } from 'http-status-codes'
const prisma = new PrismaClient()

export const getAllRatings = async (req, res) => {
  // console.log(req.user)
  const ratings = await prisma.ratings.findMany({
    where: { createdById: { equals: req.user.userId } },
  })
  res.status(StatusCodes.OK).json({ ratings })
}

export const createRating = async (req, res) => {
  const { eventId, value } = req.body
  req.body.createdById = req.user.userId

  const event = await prisma.events.findUnique({ where: { id: eventId } })
  if (!event) throw new NotFoundError(`No event with id ${eventId}`)

  const rating = await prisma.ratings.create({
    data: { eventId, value, createdById: req.body.createdById },
  })
  const eventRating = await prisma.ratings.findMany({ where: { eventId } })

  const totalRatingValue = eventRating.reduce(
    (acc, curr) => acc + curr.value,
    0
  )
  const averageRating = totalRatingValue / eventRating.length
  await prisma.events.update({
    where: { id: eventId },
    data: { averageRating },
  })

  res.status(StatusCodes.CREATED).json({ rating })
}

export const deleteRating = async (req, res) => {
  const { ratingId } = req.params

  const ratingToDelete = await prisma.ratings.findUnique({
    where: { id: ratingId },
  })
  if (!ratingToDelete) throw new NotFoundError(`No rating with id ${ratingId}`)

  await prisma.ratings.delete({ where: { id: ratingId } })

  const eventRating = await prisma.ratings.findMany({
    where: { eventId: ratingToDelete.eventId },
  })
  const totalRatingValue = eventRating.reduce(
    (acc, curr) => acc + curr.value,
    0
  )
  const averageRating =
    eventRating.length > 0 ? totalRatingValue / eventRating.length : 0

  await prisma.events.update({
    where: { id: ratingToDelete.eventId },
    data: { averageRating },
  })

  res.status(StatusCodes.OK).json({ message: 'Rating deleted successfully.' })
}
