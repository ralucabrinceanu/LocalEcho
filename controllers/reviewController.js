import { PrismaClient } from '@prisma/client'
import { NotFoundError } from '../errors/customErrors.js'
import { StatusCodes } from 'http-status-codes'
const prisma = new PrismaClient()

export const getAllReviews = async (req, res) => {
  const reviews = await prisma.reviews.findMany({
    where: { createdById: { equals: req.user.userId } },
  })
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}

export const createReview = async (req, res) => {
  const { eventId, content } = req.body
  req.body.createdById = req.user.userId

  const event = await prisma.events.findUnique({ where: { id: eventId } })
  if (!event) throw new NotFoundError(`No event with id ${eventId}`)

  const review = await prisma.reviews.create({
    data: { eventId, content, createdById: req.body.createdById },
  })
  res.status(StatusCodes.CREATED).json({ review })
}

export const deleteReview = async (req, res) => {
  const { id } = req.params
  const review = await prisma.reviews.findUnique({ where: { id } })
  if (!review) throw new NotFoundError(`No review with id ${id}`)
  const deletedReview = await prisma.reviews.delete({ where: { id } })
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Review deleted successfully', review: deletedReview })
}

// TODO
// updateReview, getSingleReview, getSingleEventReviews?
