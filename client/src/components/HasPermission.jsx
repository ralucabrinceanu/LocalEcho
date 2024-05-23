import React, { useState, useEffect } from 'react'
import ServerError from './ServerError'

const HasPermission = ({ children, requiredRoles = [] }) => {
  const [hasPermission, setHasPermission] = useState(false)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (
      user &&
      user.role &&
      requiredRoles.some((role) => user.role.includes(role))
    ) {
      setHasPermission(true)
    }
  }, [requiredRoles])

  return <>{hasPermission ? children : <ServerError />}</>
}

export default HasPermission
