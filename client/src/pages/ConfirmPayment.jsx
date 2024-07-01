import React from 'react'
import { Link } from 'react-router-dom'

const ConfirmPayment = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold mb-4 text-center">
        Thank you for the order!
      </h1>
      <p className="text-lg text-center">
        Your payment has been successfully confirmed.
      </p>

      <div className="flex mt-8">
        <Link
          to="/orders/showAllMyOrders"
          className="btn btn-outline flex-1 mr-2"
        >
          My orders
        </Link>
        <Link to="/events" className="btn btn-outline flex-1 ml-2">
          Events
        </Link>
      </div>
    </div>
  )
}

export default ConfirmPayment
