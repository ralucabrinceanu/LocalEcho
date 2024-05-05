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

// TODO
// validateIdParam

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
    .withMessage('password must be at least 6 characters long'),
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
    .withMessage('Title is required ')
    .isLength({ min: 3, max: 100 }),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  body('date')
    .isISO8601()
    .toDate()
    .custom((value, { req }) => {
      if (new Date(value) < new Date()) {
        // req.body.eventStatus = 'COMPLETED'
        throw new Error('Event date cannot be in the past')
      }
      return true
    })
    .withMessage('Date must be a valid date '),
  body('eventStatus')
    .optional()
    .isIn(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD'])
    .withMessage('Invalid event status '),
  body('eventCategory')
    .optional()
    .isIn([
      'MUSIC',
      'ART_AND_CULTURE',
      'FOOD_AND_DRINK',
      'FAMILY_AND_KIDS',
      'CHARITY',
      'HEALTH_AND_WELLNESS',
    ])
    .withMessage('Invalid event category '),
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

export const validateUserRoleInput = withValidationErrors([
  body('userId').notEmpty().withMessage('userId is required'),
  body('role')
    .notEmpty()
    .withMessage('role is required')
    .isIn(['USER', 'ADMIN', 'EVENT_PLANNER'])
    .withMessage('Invalid role'),
])
