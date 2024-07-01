import React from 'react'
import { useLoaderData } from 'react-router-dom'
import { formatPrice } from '../utils'

const OrderList = () => {
  const { orders, meta, users } = useLoaderData()
  // console.log(meta.pagination.totalOrders)

  // TODO pagination !!

  const getUsername = (userId) => {
    const user = users.find((user) => user.id === userId)
    const firstName =
      user.firstName.charAt(0).toUpperCase() +
      user.firstName.slice(1).toLowerCase()
    const lastName =
      user.lastName.charAt(0).toUpperCase() +
      user.lastName.slice(1).toLowerCase()
    const name = firstName + ' ' + lastName
    return user ? name : 'Unknown User'
  }

  const getUserEmail = (userId) => {
    const user = users.find((user) => user.id === userId)
    const email = user.email
    return user ? email : 'Unknown Email'
  }

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
    return new Date(dateTimeString).toLocaleDateString(undefined, options)
  }
  if (meta.pagination.totalOrders === 0) {
    return (
      <section className="mt-6">
        <h1 className="text-3xl font-bold">Place an order now!</h1>
      </section>
    )
  }

  return (
    <div className="mt-8">
      <h4 className="mb-4 capitalize">
        total orders: {meta.pagination.totalOrders}
      </h4>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Cost</th>
              <th className="hidden sm:block">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              // console.log(order)
              const { id, total, createdAt } = order
              const userName = getUsername(order.orderedById)

              return (
                <tr key={id}>
                  <td>{userName}</td>
                  <td>{getUserEmail(order.orderedById)}</td>
                  <td>{formatPrice(total)}</td>
                  <td>{formatDateTime(createdAt)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OrderList
