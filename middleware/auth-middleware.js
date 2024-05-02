import {
  UnauthenticatedError,
  UnauthorizedError,
} from '../errors/customErrors.js'
import { verifyJWT } from '../utils/tokenUtils.js'

export const authenticateUser = (req, res, next) => {
  const { tokenName } = req.cookies
  if (!tokenName) throw new UnauthenticatedError('Authentication invalid')

  try {
    const { userId, role } = verifyJWT(tokenName)
    req.user = { userId, role }
    // const user = verifyJWT(tokenName)
    // console.log(user)
    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid')
  }
}

export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    // console.log('user roles:', req.user.role)
    // console.log('allowed roles:', roles)

    const allowed = roles.some((role) => req.user.role.includes(role))
    if (!allowed) {
      throw new UnauthorizedError('Unauthorized to access this route')
    }
    next()
  }
}
