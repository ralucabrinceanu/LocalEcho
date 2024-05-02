import { body, param, validationResult } from 'express-validator'
import { BadRequestError } from '../errors/customErrors.js'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg)
        throw new BadRequestError(errorMessages)
      }
      next()
    },
  ]
}

export const validateVenueInput = withValidationErrors([
  body('name').notEmpty().withMessage('name is required'),
  body('address').notEmpty().withMessage('address is required'),
  body('capacity').notEmpty().withMessage('capacity is required'),
  body('city').notEmpty().withMessage('city is required'),
])

// export const validateIdParam = withValidationErrors([
//   param('id').isUUID(4).withMessage('Invalid UUID format for ID parameter'),
// ])

export const validateRegisterInput = withValidationErrors([
  body('firstName').notEmpty().withMessage('firstName is required'),
  body('lastName').notEmpty().withMessage('lastName is required'),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async (email) => {
      const user = await prisma.users.findUnique({ where: { email } })
      if (user) throw new BadRequestError('email already exists')
    }),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 6 })
    .withMessage('password must be at least 8 characters long'),
])

export const validateLoginInput = withValidationErrors([
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format'),
  body('password').notEmpty().withMessage('password is required'),
])

export const validateEventInput = withValidationErrors([
  body('title')
    .notEmpty()
    .withMessage('title is required')
    .isLength({ min: 3, max: 100 }),
  body('description')
    .optional()
    .isString()
    .withMessage('description must be a string'),
  body('date').isISO8601().toDate().withMessage('date must be a valid date'),
])

export const validateRatingInput = withValidationErrors([
  body('eventId')
    .notEmpty()
    .withMessage('Event ID is required')
    .isUUID()
    .withMessage('Invalid event ID format'),
  body('value')
    .notEmpty()
    .withMessage('Rating value is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating value must be between 1 and 5'),
])

export const validateReviewInput = withValidationErrors([
  body('eventId')
    .notEmpty()
    .withMessage('Event ID is required')
    .isUUID()
    .withMessage('Invalid event ID format'),
  body('content')
    .notEmpty()
    .withMessage('Review content is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Review content must be between 10 and 500 characters')
    .matches(/^[a-zA-Z0-9.,!? ]*$/)
    .withMessage('Review content contains invalid characters'),
])

export const validateUpdateUserInput = withValidationErrors([
  body('firstName').notEmpty().withMessage('firstName is required'),
  body('lastName').notEmpty().withMessage('lastName is required'),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async (email, { req }) => {
      // console.log(req.user)
      const user = await prisma.users.findUnique({ where: { email } })
      if (user && user.id !== req.user.userId)
        throw new BadRequestError('email already exists')
    }),
])
