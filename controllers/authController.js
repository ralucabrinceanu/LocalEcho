import { StatusCodes } from 'http-status-codes'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { hashPassword, comparePassword } from '../utils/passwordUtils.js'
import { UnauthenticatedError } from '../errors/customErrors.js'
import { createJWT } from '../utils/tokenUtils.js'
import { token } from 'morgan'

export const register = async (req, res) => {
  const { firstName, lastName, email } = req.body

  const isFirstAccount = (await prisma.users.count()) === 0
  const role = isFirstAccount ? ['ADMIN'] : ['USER']

  const hashedPassword = await hashPassword(req.body.password)
  req.body.password = hashedPassword

  const user = await prisma.users.create({
    data: { firstName, lastName, email, password: hashedPassword, role },
  })
  res.status(StatusCodes.CREATED).json({ msg: 'user created' })
}

export const login = async (req, res) => {
  const { email, password } = req.body
  const user = await prisma.users.findUnique({ where: { email } })
  // if (!user) throw new UnauthenticatedError('invalid credentials')
  // const isPasswordCorrect = await comparePassword(password, user.password)
  // if (!isPasswordCorrect) throw new UnauthenticatedError('invalid credentials')

  const isValidUser = user && (await comparePassword(password, user.password))
  if (!isValidUser) throw new UnauthenticatedError('invalid credentials')

  const token = createJWT({ userId: user.id, role: user.role })
  const oneDay = 24 * 60 * 60 * 1000
  res.cookie('tokenName', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
  })
  res.status(StatusCodes.OK).json({ msg: 'user logged in' })
}

export const logout = async (req, res) => {
  res.cookie('tokenName', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  })
  res.status(StatusCodes.OK).json({ msg: 'user logged out' })
}
