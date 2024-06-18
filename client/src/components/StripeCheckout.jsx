import React from 'react'
import { useLoaderData } from 'react-router-dom'

const StripeCheckout = () => {
  const { cart, user } = useLoaderData()
  //   console.log('CART', cart)
  //   console.log('USER', user)

  const firstName =
    user.firstName.charAt(0).toUpperCase() +
    user.firstName.slice(1).toLowerCase()
  const lastName =
    user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1).toLowerCase()
  const name = firstName + ' ' + lastName

  return (
    <>
      <article>
        <h4>Hello, {name}</h4>
        <p>Your total is {cart.total} RON </p>
      </article>
    </>
  )
}

export default StripeCheckout
