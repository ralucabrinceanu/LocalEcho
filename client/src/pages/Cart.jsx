import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { CartItemsList, CartTotals, SectionTitle } from '../components'
import customFetch from '../utils'

export const loader = async () => {
  const response = await customFetch.get('/tickets')
  const tickets = response.data.tickets
  // console.log(response.data)

  const evResponse = await customFetch.get('/events')
  const events = evResponse.data.events
  // console.log(events)

  return { tickets, events }
}

const Cart = () => {
  const user = useSelector((state) => state.userState.user)
  // console.log(user)
  const numItemsInCart = useSelector((state) => state.cartState.numItemsInCart)

  if (numItemsInCart === 0) {
    return <SectionTitle text="Your cart is empty" />
  }
  return (
    <>
      <SectionTitle text="Shopping Cart" />
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <CartItemsList />
        </div>
        <div className="lg:col-span-4 lg:pl-4">
          <CartTotals />
          {user ? (
            <Link to="/checkout" className="btn btn-accent btn-block mt-8">
              PROCEED TO CHECKOUT
            </Link>
          ) : (
            <Link to="/login" className="btn btn-accent btn-block mt-8">
              PLEASE LOGIN
            </Link>
          )}
        </div>
      </div>
    </>
  )
}

export default Cart
