import { StatusCodes } from 'http-status-codes'
import { NotFoundError, UnauthorizedError } from '../errors/customErrors.js'
import cloudinary from 'cloudinary'
import { promises as fs } from 'fs'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getAllUsers = async (req, res) => {
  const users = await prisma.users.findMany()
  res.status(StatusCodes.OK).json({ users })
}

export const getCurrentUser = async (req, res) => {
  const user = await prisma.users.findUnique({ where: { id: req.user.userId } })
  const { password, ...userWithoutPassword } = user
  res.status(StatusCodes.OK).json({ user: userWithoutPassword })
}

export const getApplicationStats = async (req, res) => {
  const users = await prisma.users.count()
  const events = await prisma.events.count()
  const venues = await prisma.venues.count()
  res
    .status(StatusCodes.OK)
    .json({ msg: 'application stats', users, events, venues })
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
