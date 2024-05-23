import { PrismaClient } from '@prisma/client'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError } from '../errors/customErrors.js'
const prisma = new PrismaClient()

export const getAllTestimonials = async (req, res) => {
  const { rating } = req.query

  let queryOptions = {}
  if (rating) {
    queryOptions.where = {
      rating: parseInt(rating, 10),
    }
  }

  const testimonials = await prisma.reviews.findMany(queryOptions)

  res.status(StatusCodes.OK).json({ testimonials, count: testimonials.length })
}

export const createTestimonial = async (req, res) => {
  const { rating, content } = req.body
  const userId = req.user.userId
  const existingTestimonial = await prisma.reviews.findFirst({
    where: { createdById: userId },
  })
  if (existingTestimonial) throw new BadRequestError('Already Submitted')

  const currentDate = new Date()
  const testimonial = await prisma.reviews.create({
    data: { rating, content, createdById: userId, createdAt: currentDate },
  })

  res.status(StatusCodes.CREATED).json({ testimonial })
}

export const deleteTestimonial = async (req, res) => {
  const { id } = req.params
  const testimonial = await prisma.reviews.findUnique({ where: { id } })
  if (!testimonial) throw new NotFoundError(`No testimonial with id ${id}`)
  const deletedTestimonial = await prisma.reviews.delete({ where: { id } })
  res.status(StatusCodes.OK).json({
    msg: 'Testimonial deleted successfully',
    testimonial: deletedTestimonial,
  })
}
