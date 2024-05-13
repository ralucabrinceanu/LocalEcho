import { PrismaClient } from '@prisma/client'
import { BadRequestError, NotFoundError } from '../errors/customErrors.js'
import { StatusCodes } from 'http-status-codes'
const prisma = new PrismaClient()

export const getAllReviews = async (req, res) => {
  const reviews = await prisma.reviews.findMany()
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}

export const createReview = async (req, res) => {
  const { eventId, content, rating } = req.body
  const userId = req.user.userId

  const event = await prisma.events.findUnique({ where: { id: eventId } })
  if (!event) throw new NotFoundError(`No event with id ${eventId}`)

  const existingReview = await prisma.reviews.findFirst({
    where: { eventId, createdById: userId },
  })
  if (existingReview) throw new BadRequestError('Already Submitted')
  const review = await prisma.reviews.create({
    data: { eventId, rating, content, createdById: userId },
  })

  res.status(StatusCodes.CREATED).json({ review })
}

export const getSingleReview = async (req, res) => {
  const { id } = req.params

  const review = await prisma.reviews.findUnique({ where: { id } })
  if (!review) throw new NotFoundError(`No review with id ${id}`)

  res.status(StatusCodes.OK).json({ review })
}

export const updateReview = async (req, res) => {
  const { id } = req.params
  const { rating, content } = req.body

  const review = await prisma.reviews.findUnique({ where: { id } })
  if (!review) throw new NotFoundError(`No review with id ${id}`)

  if (review.createdById !== req.user.userId)
    throw new UnauthorizedError('Not authorized to update this review')

  const updatedReview = await prisma.reviews.update({
    where: { id },
    data: { rating, content },
  })

  res
    .status(StatusCodes.OK)
    .json({ msg: 'Review modified', review: updatedReview })
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

export const getSingleEventReviews = async (req, res) => {
  const { id: eventId } = req.params

  const event = await prisma.events.findUnique({ where: { id: eventId } })
  if (!event) throw new BadRequestError(`No event with id ${eventId}`)

  const reviews = await prisma.reviews.findMany({
    where: {
      eventId,
    },
  })
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}
