import React from 'react'
import { useLoaderData } from 'react-router-dom'

const OrderListAdmin = () => {
  const { orders, users } = useLoaderData()

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

  const sortedOrders = [...orders].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  return (
    <div className="mt-8">
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Cost</th>
              <th className="hidden sm:block">Date</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order, index) => {
              // console.log(order)
              const { id, total, createdAt } = order
              const userName = getUsername(order.orderedById)

              return (
                <tr key={id}>
                  <td>{index + 1}</td>
                  <td>{userName}</td>
                  <td>{getUserEmail(order.orderedById)}</td>
                  <td>{total} RON</td>
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

export default OrderListAdmin