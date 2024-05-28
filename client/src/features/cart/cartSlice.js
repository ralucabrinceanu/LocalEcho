import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const defaultState = {
  orderItems: [],
  numItemsInCart: 0,
  total: 0,
}

const getCartFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem('cart')) || defaultState
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: getCartFromLocalStorage(),
  reducers: {
    addItem: (state, action) => {
      const newOrders = action.payload.order
      console.log(newOrders)
      newOrders.forEach((order) => {
        const existingItem = state.orderItems.find(
          (item) => item.ticketId === order.ticketId
        )
        if (existingItem) {
          existingItem.amount += order.amount
          state.total += order.price * order.amount
          state.numItemsInCart += order.amount
        } else {
          state.orderItems.push({ ...order })
          state.total += order.price * order.amount
          state.numItemsInCart += order.amount
        }
        localStorage.setItem('cart', JSON.stringify(state))
        toast.success('Tickets added to cart')
      })
    },
    clearCart: (state) => {
      localStorage.setItem('cart', JSON.stringify(defaultState))
      return defaultState
    },
    removeItem: (state, action) => {
      // console.log('REMOVE', action.payload)
      const { ticketId } = action.payload
      const ticket = state.orderItems.find((item) => item.ticketId === ticketId)
      state.orderItems = state.orderItems.filter(
        (item) => item.ticketId !== ticketId
      )
      state.numItemsInCart -= ticket.amount
      state.total -= ticket.price * ticket.amount
      localStorage.setItem('cart', JSON.stringify(state))
      toast.error('Ticket/s removed from cart')
    },
    editItem: (state, action) => {
      const { ticketId, amount } = action.payload
      const ticket = state.orderItems.find((item) => item.ticketId === ticketId)
      state.numItemsInCart += amount - ticket.amount
      state.total += ticket.price * (amount - ticket.amount)
      ticket.amount = amount
      localStorage.setItem('cart', JSON.stringify(state))
      toast.success('Cart Updated')
    },
  },
})

export const { addItem, clearCart, removeItem, editItem } = cartSlice.actions
export default cartSlice.reducer
