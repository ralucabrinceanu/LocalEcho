import { StatusCodes } from 'http-status-codes'
import { NotFoundError, UnauthorizedError } from '../errors/customErrors.js'
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
  //   console.log(req.user)
  //   console.log(req.body)

  const user = await prisma.users.findUnique({ where: { id: req.user.userId } })
  if (!user) throw new NotFoundError(`No user with id ${req.user.userId}`)
  //   console.log(user)
  const updatedUser = await prisma.users.update({
    where: { id: req.user.userId },
    data: req.body,
  })
  // console.log(updatedUser)
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
