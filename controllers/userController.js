import { StatusCodes } from 'http-status-codes'
import cloudinary from 'cloudinary'
import { promises as fs } from 'fs'
import { PrismaClient } from '@prisma/client'
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
} from '../errors/customErrors.js'
import { comparePassword, hashPassword } from '../utils/passwordUtils.js'

const prisma = new PrismaClient()

export const getAllUsers = async (req, res) => {
  const { search, sort } = req.query
  const queryObject = {}

  if (search) {
    queryObject.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ]
  }

  const order = sort === 'asc' ? 'asc' : 'desc'
  const users = await prisma.users.findMany({
    where: queryObject,
    orderBy: { verified: order },
  })

  res.status(StatusCodes.OK).json({ users })
}

export const getCurrentUser = async (req, res) => {
  const user = await prisma.users.findUnique({ where: { id: req.user.userId } })
  const { password, ...userWithoutPassword } = user
  res.status(StatusCodes.OK).json({ user: userWithoutPassword })
}

export const getApplicationStats = async (req, res) => {
  const users = await prisma.users.count()
  // const events = await prisma.events.count()
  const completedEvents = await prisma.events.count({
    where: {
      eventStatus: 'COMPLETED',
    },
  })
  const scheduledEvents = await prisma.events.count({
    where: {
      eventStatus: 'SCHEDULED',
    },
  })
  const liveEvents = await prisma.events.count({
    where: {
      eventStatus: 'RIGHT_NOW',
    },
  })

  res.status(StatusCodes.OK).json({
    msg: 'application stats',
    users,
    completedEvents,
    scheduledEvents,
    liveEvents,
  })
}

export const updateUser = async (req, res) => {
  // console.log('REQ.FILE ----------------------------> :', req.file)
  const user = await prisma.users.findUnique({ where: { id: req.user.userId } })
  if (!user) throw new NotFoundError(`No user with id ${req.user.userId}`)

  let updatedUserData = { ...req.body }
  // console.log(updatedUserData)

  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(req.file.path)
    await fs.unlink(req.file.path)
    updatedUserData.avatar = response.secure_url
    updatedUserData.avatarPublicId = response.public_id
  }
  if (req.file && user.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(user.avatarPublicId)
  }

  const updatedUser = await prisma.users.update({
    where: { id: req.user.userId },
    data: updatedUserData,
  })
  const { password, ...userWithoutPassword } = updatedUser

  res
    .status(StatusCodes.OK)
    .json({ msg: 'User updated successfully', user: userWithoutPassword })
}

export const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body
  if (!oldPassword || !newPassword)
    throw new BadRequestError(`Please provide both values`)

  const user = await prisma.users.findUnique({ where: { id: req.user.userId } })
  if (!user) throw new UnauthenticatedError('User not found')

  const isPasswordCorrect = await comparePassword(oldPassword, user.password)
  if (!isPasswordCorrect) throw new UnauthenticatedError('Invalid Credentials')

  const hashedNewPassword = await hashPassword(newPassword)
  await prisma.users.update({
    where: { id: req.user.userId },
    data: { password: hashedNewPassword },
  })

  res.status(StatusCodes.OK).json({ msg: 'Password Updated' })
}

export const updateUserRole = async (req, res) => {
  const { userId, role } = req.body
  // console.log('REQ.BODY', userId)
  const updatedUser = await prisma.users.update({
    where: { id: userId },
    data: { role: [role] },
  })
  const { password, ...userWithoutPassword } = updatedUser
  res
    .status(StatusCodes.OK)
    .json({ msg: 'User role updated successfully', user: userWithoutPassword })
}

export const deleteUser = async (req, res) => {
  const { id } = req.params

  const user = await prisma.users.findUnique({
    where: { id },
  })
  if (!user) throw new BadRequestError(`No user with id ${id}`)

  const deletedUser = await prisma.users.delete({ where: { id } })
  res.status(StatusCodes.OK).json({ msg: 'User deleted successfully' })
}
