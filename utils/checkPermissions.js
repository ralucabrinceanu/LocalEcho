import { UnauthorizedError } from '../errors/customErrors.js'

export const checkPermissions = (requestUser, resourceUserId) => {
  //   console.log(requestUser)
  //   console.log(resourceUserId)
  //   console.log(typeof resourceUserId)

  if (requestUser.role === 'ADMIN') return
  if (requestUser.userId === resourceUserId) return
  throw new UnauthorizedError('Not authorize to access this route')
}
