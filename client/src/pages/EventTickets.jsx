import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import customFetch from '../utils'
import { Link, useLoaderData } from 'react-router-dom'
import AmountButtons from '../components/AmountButtons.jsx'
import { addItem } from '../features/cart/cartSlice.js'
import theatre from '../assets/theatre.jpg'
import { toast } from 'react-toastify'

export const loader = async ({ params }) => {
  const response = await customFetch.get(`/events/${params.id}`)
  const event = response.data.event
  // console.log('EVENT: ', event)

  const tickResp = await customFetch.get(`/events/${params.id}/tickets`)
  const tickets = tickResp.data.tickets
  // console.log('TICKETS: ', tickets)

  return { event, tickets }
}

const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }
  const formatOptions = { ...defaultOptions, ...options }
  return new Date(dateString).toLocaleString('en-US', formatOptions)
}

const isSameDay = (start, end) => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  return (
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getDate() === endDate.getDate()
  )
}

const formatEventDate = (startDate, endDate) => {
  if (isSameDay(startDate, endDate)) {
    const startTime = formatDate(startDate, {
      year: undefined,
      month: undefined,
      day: undefined,
    })
    const endTime = formatDate(endDate, {
      year: undefined,
      month: undefined,
      day: undefined,
    })
    return `${formatDate(startDate, {
      hour: undefined,
      minute: undefined,
    })}, ${startTime} - ${endTime}`
  } else {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`
  }
}

const EventTickets = () => {
  const { event, tickets } = useLoaderData()
  const { title, startDate, endDate } = event
  // console.log(tickets)

  const [amounts, setAmounts] = useState(
    tickets.reduce(
      (acc, ticket) => ({
        ...acc,
        [ticket.id]: 0,
      }),
      {}
    )
  )

  const increase = (id) => {
    setAmounts((prevAmounts) => ({
      ...prevAmounts,
      [id]: Math.min(
        prevAmounts[id] + 1,
        tickets.find((t) => t.id === id).ticketsAvailable
      ),
    }))
  }

  const decrease = (id) => {
    setAmounts((prevAmounts) => ({
      ...prevAmounts,
      [id]: Math.max(prevAmounts[id] - 1, 0),
    }))
  }

  const items = tickets
    .map((ticket) => ({
      ticketId: ticket.id,
      amount: amounts[ticket.id],
      price: ticket.price, //! adauga alte  chestii aici daca vrei
    }))
    .filter((item) => item.amount > 0)

  const dispatch = useDispatch()

  const addToBag = async () => {
    // console.log(items.length)
    if (items.length === 0) {
      toast.error('Select a ticket.')
    } else {
      dispatch(addItem({ order: items }))
    }
  }

  return (
    <>
      <section>
        <div className="mt-6 grid gap-y-8 lg:grid-cols-2 lg:gap-x-16">
          {/* //TODO image */}
          <img
            src={theatre}
            alt={title}
            className="w-96 h-96 object-cover rounded-lg lg:w-full"
          />
          <div>
            <h1 className="capitalize text-3xl font-bold">{title}</h1>
            <p className="mt-3 text-xl">
              {formatEventDate(startDate, endDate)}
            </p>
            <div className="overflow-x-auto mt-10">
              <table className="table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Available</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr className="bg-base-200" key={ticket.id}>
                      <td>{ticket.ticketType}</td>
                      <td>{ticket.price} RON</td>
                      <td>{ticket.ticketsAvailable}</td>
                      <td>
                        <AmountButtons
                          increase={() => increase(ticket.id)}
                          decrease={() => decrease(ticket.id)}
                          amount={amounts[ticket.id]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-10">
                <button className="btn btn-outline btn-md" onClick={addToBag}>
                  Buy Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default EventTickets
