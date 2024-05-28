import React from 'react'
import { useSelector } from 'react-redux'
import CartItem from '../components/CartItem'

const CartItemsList = () => {
  const orderItems = useSelector((state) => state.cartState.orderItems)
  // console.log(orderItems)

  return (
    <>
      {orderItems.map((item) => {
        return <CartItem key={item.ticketId} orderItem={item} />
      })}
    </>
  )
}

export default CartItemsList
