import React from 'react'
import { useSelector } from 'react-redux'
import CartItem from '../components/CartItem'
import { useLoaderData } from 'react-router-dom'

const CartItemsList = () => {
  const orderItems = useSelector((state) => state.cartState.orderItems)
  console.log('ORDER ITEMS', orderItems)
  const { events, tickets } = useLoaderData()
  console.log('TICKETS', tickets)
  console.log('EVENTS', events)

  return (
    <>
      {orderItems.map((item) => {
        return <CartItem key={item.ticketId} orderItem={item} />
      })}
    </>
  )
}

export default CartItemsList
