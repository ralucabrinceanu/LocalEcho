import { StatusCodes } from 'http-status-codes'
import { NotFoundError } from '../errors/customErrors.js'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

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
  const dataToUpdate = await prisma.users.update({
    where: { id: req.user.userId },
    data: req.body,
  })
  //   console.log(dataToUpdate)
  const { password, ...userWithoutPassword } = dataToUpdate
  res
    .status(StatusCodes.OK)
    .json({ msg: 'User updated successfully', user: userWithoutPassword })
}
