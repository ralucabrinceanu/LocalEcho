import React, { useState } from 'react'
import { Form, useLoaderData } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { MdDeleteOutline } from 'react-icons/md'
import { AiOutlineEdit } from 'react-icons/ai'
import AmountButtons from './AmountButtons'
import SubmitBtn from './SubmitBtn'
import { addItem } from '../features/cart/cartSlice'
import { toast } from 'react-toastify'

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

const TicketsPerEvent = ({ showBuyButton = true }) => {
  const { event, tickets } = useLoaderData()
  const { title, startDate, endDate, image } = event
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
      price: ticket.price, //! adauga alte chestii aici daca vrei
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
  if (tickets.length === 0) {
    return (
      <section className="mt-6">
        <h1 className="text-3xl font-bold">No tickets available...</h1>
      </section>
    )
  }
  return (
    <>
      <section>
        <div className="mt-6 grid gap-y-8 lg:grid-cols-2 lg:gap-x-16">
          <img
            src={image}
            alt={title}
            className="w-96 h-96 object-cover rounded-lg lg:w-full"
          />
          <div>
            <h1 className="capitalize text-3xl font-bold">{title}</h1>
            <p className="mt-3 text-xl">
              {formatEventDate(startDate, endDate)}
            </p>
            <div className="overflow-x-auto mt-10">
              <table className="table text-center">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Available</th>
                    {showBuyButton && <th>Quantity</th>}
                    {!showBuyButton && <th>Change</th>}
                    {!showBuyButton && <th>Delete</th>}
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr className="bg-base-200" key={ticket.id}>
                      <td>{ticket.ticketType}</td>
                      <td>{ticket.price} RON</td>
                      <td>{ticket.ticketsAvailable}</td>
                      {showBuyButton && (
                        <td>
                          <AmountButtons
                            increase={() => increase(ticket.id)}
                            decrease={() => decrease(ticket.id)}
                            amount={amounts[ticket.id]}
                          />
                        </td>
                      )}
                      {!showBuyButton && (
                        <td>
                          <button
                            className="btn"
                            onClick={() =>
                              document
                                .getElementById(`my_modal_${ticket.id}`)
                                .showModal()
                            }
                          >
                            <AiOutlineEdit />
                          </button>

                          <dialog
                            id={`my_modal_${ticket.id}`}
                            className="modal"
                          >
                            <div className="modal-box">
                              <Form
                                method="post"
                                action={`/edit-ticket/${ticket.id}`}
                              >
                                <h3 className="font-bold text-lg">
                                  Change ticket data
                                </h3>
                                <div className="my-4"></div>

                                <div>
                                  <label>Tickets available</label>
                                  <input
                                    type="number"
                                    name="ticketsAvailable"
                                    defaultValue={ticket.ticketsAvailable}
                                    className="input input-bordered w-52 max-w-xs mb-4"
                                  />
                                </div>

                                <div>
                                  <label>Ticket price</label>
                                  <input
                                    type="number"
                                    name="price"
                                    defaultValue={ticket.price}
                                    className="input input-bordered w-52 max-w-xs"
                                  />
                                </div>

                                <SubmitBtn
                                  className="mt-4 w-52 max-w-xs"
                                  text="Change"
                                />
                              </Form>

                              <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                  ✕
                                </button>
                              </form>
                            </div>
                          </dialog>
                        </td>
                      )}

                      {!showBuyButton && (
                        <td>
                          <Form
                            method="post"
                            action={`/delete-tickets/${ticket.id}`}
                          >
                            <button type="submit">
                              <MdDeleteOutline />
                            </button>
                          </Form>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {showBuyButton && (
                <div className="mt-10">
                  <button className="btn btn-outline btn-md" onClick={addToBag}>
                    Buy Ticket
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default TicketsPerEvent
