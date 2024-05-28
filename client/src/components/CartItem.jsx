import React from 'react'
import { useDispatch } from 'react-redux'
import { editItem, removeItem } from '../features/cart/cartSlice'
import AmountButtons from './AmountButtons'
import { useLoaderData } from 'react-router-dom'

const CartItem = ({ orderItem }) => {
  const dispatch = useDispatch()

  const removeItemFromCart = () => {
    dispatch(removeItem({ ticketId }))
  }

  const updateAmount = (newAmount) => {
    if (newAmount >= 1) {
      dispatch(editItem({ ticketId: orderItem.ticketId, amount: newAmount }))
    }
  }

  const { amount, price, ticketId } = orderItem
  const { tickets, events } = useLoaderData()

  const getTicketType = () => {
    const ticket = tickets.find((ticket) => ticket.id === ticketId)
    return ticket ? ticket.ticketType : 'Unknown Ticket Type'
  }

  const getEventName = () => {
    const ticket = tickets.find((ticket) => ticket.id === ticketId)
    if (ticket) {
      const event = events.find((event) => event.id === ticket.eventId)
      return event ? event.title : 'Unknown Event'
    }
    return 'Loading...'
  }

  return (
    <article
      key={ticketId}
      className="mb-12 flex flex-col gap-y-4 sm:flex-row flex-wrap border-b border-base-300 pb-6 last:border-b-0"
    >
      {/* INFO */}
      <div className="sm:ml-10 sm:w-40">
        <h3 className="capitalize font-medium">{getEventName()}</h3>
        <h4 className="mt-2 capitalize text-sm text-neutral-content">
          {getTicketType()}
        </h4>
      </div>

      <div className="sm:ml-auto ">
        {/* AMOUNT */}
        <div className="sm:ml-auto flex items-center">
          <AmountButtons
            amount={amount}
            increase={() => updateAmount(amount + 1)}
            decrease={() => updateAmount(amount - 1)}
          />
        </div>
        {/* REMOVE */}
        <button
          className="link link-accent link-hover text-sm ml-0 mt-2"
          onClick={removeItemFromCart}
        >
          remove
        </button>
      </div>

      {/* PRICE  */}
      <div className="flex items-center sm:ml-auto">
        <p className="font-medium">{price} RON</p>
      </div>
    </article>
  )
}

export default CartItem
