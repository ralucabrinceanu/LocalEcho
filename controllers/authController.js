import { StatusCodes } from 'http-status-codes'
import crypto from 'crypto'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { hashPassword, comparePassword } from '../utils/passwordUtils.js'
import {
  BadRequestError,
  UnauthenticatedError,
} from '../errors/customErrors.js'
import { createJWT } from '../utils/tokenUtils.js'
import { sendVerificationEmail } from '../utils/sendVerificationEmail.js'
import { sendResetPasswordEmail } from '../utils/sendResetPasswordEmail.js'
import hashString from '../utils/createHash.js'

export const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body

  const isFirstAccount = (await prisma.users.count()) === 0
  const role = isFirstAccount ? ['ADMIN'] : ['USER']

  const verificationToken = crypto.randomBytes(20).toString('hex')

  const hashedPassword = await hashPassword(req.body.password)
  req.body.password = hashedPassword

  const user = await prisma.users.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      verificationToken,
    },
  })

  const origin = 'http://localhost:5173'
  await sendVerificationEmail({
    name: user.firstName,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  })

  res.status(StatusCodes.CREATED).json({
    msg: 'User Created. Please check your email to verify account',
    verificationToken: user.verificationToken,
  })
}

export const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body

  const user = await prisma.users.findUnique({ where: { email } })
  if (!user) throw new UnauthenticatedError('Verification Failed')

  if (user.verificationToken !== verificationToken) {
    throw new UnauthenticatedError('Verification Failed')
  }

  await prisma.users.update({
    where: { email },
    data: {
      verificationToken: '',
      isVerified: true,
      verified: new Date(),
    },
  })

  res.status(StatusCodes.OK).json({ msg: 'Email Verified' })
}

export const login = async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.users.findUnique({ where: { email } })

  const isValidUser = user && (await comparePassword(password, user.password))
  if (!isValidUser) throw new UnauthenticatedError('invalid credentials')

  if (!user.isVerified) {
    throw new UnauthenticatedError('Please verify your email')
  }

  const token = createJWT({ userId: user.id, role: user.role })
  const oneDay = 24 * 60 * 60 * 1000
  res.cookie('tokenName', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
  })

  res.status(StatusCodes.OK).json({ msg: 'user logged in', user, token })
}

export const logout = async (req, res) => {
  res.cookie('tokenName', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  })
  res.status(StatusCodes.OK).json({ msg: 'user logged out' })
}

export const forgotPassword = async (req, res) => {
  const { email } = req.body
  if (!email) throw new BadRequestError('Please provide valid email')

  const user = await prisma.users.findUnique({ where: { email } })
  if (user) {
    const passwordToken = crypto.randomBytes(20).toString('hex')
    // send email
    const origin = 'http://localhost:5173'
    await sendResetPasswordEmail({
      name: user.firstName,
      email: user.email,
      token: passwordToken,
      origin,
    })

    const fiveMinutes = 5 * 60 * 1000
    const passwordTokenExpirationDate = new Date(Date.now() + fiveMinutes)

    await prisma.users.update({
      where: { email },
      data: {
        passwordToken: hashString(passwordToken),
        passwordTokenExpirationDate,
      },
    })
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: 'Please check your email for reset password link' })
}

export const resetPassword = async (req, res) => {
  const { token, email, password } = req.body
  if (!token || !email || !password)
    throw new BadRequestError('Please provide all values')

  const user = await prisma.users.findUnique({ where: { email } })

  if (user) {
    const currentDate = new Date()
    if (
      user.passwordToken === hashPassword(token) &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      await prisma.users.update({
        where: { email },
        data: {
          password,
          passwordToken: null,
          passwordTokenExpirationDate: null,
        },
      })
    }
  }

  res.send('Password reset successful')
}

// TODO: nu stiu ce am facut cu resetare parola + forgot
