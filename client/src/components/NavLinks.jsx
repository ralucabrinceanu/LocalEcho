import React from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

const links = [
  { id: 1, url: '/', text: 'home' },
  { id: 2, url: 'about', text: 'about' },
  { id: 3, url: 'events', text: 'events' },
  { id: 4, url: 'admin', text: 'admin' },
  { id: 5, url: 'event-planner', text: 'event planner' },
  { id: 6, url: 'cart', text: 'cart' },
  { id: 7, url: 'checkout', text: 'checkout' },
  { id: 8, url: 'orders/showAllMyOrders', text: 'orders' },
]

const NavLinks = () => {
  const user = useSelector((state) => state.userState.user)

  return (
    <>
      {links.map((link) => {
        const { id, url, text } = link

        if (
          url === 'event-planner' &&
          (!user || !user.role.includes('EVENT_PLANNER'))
        )
          return null

        if (url === 'admin' && (!user || !user.role.includes('ADMIN')))
          //! restrictionare pagini
          return null

        if ((url === 'checkout' || url === 'orders') && !user) return null

        return (
          <li key={id}>
            <NavLink className="capitalize" to={url}>
              {text}
            </NavLink>
          </li>
        )
      })}
    </>
  )
}

export default NavLinks
