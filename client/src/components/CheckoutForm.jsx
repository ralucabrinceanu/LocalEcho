import React, { useState, useEffect } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const CheckoutForm = (props) => {
  const stripe = useStripe()
  const elements = useElements()

  const [message, setMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }
    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:5173/orders/showAllMyOrders',
      },
      // confirmParams: { return_url: `${window.location.origin}/completion` },
    })

    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message)
    } else {
      setMessage('An unexpected error occurred...')
    }
    setIsLoading(false)
  }

  const paymentElementOptions = {
    layout: 'tabs',
  }

  return (
    <form
      onSubmit={handleSubmit}
      id="payment-form"
      className="w-30vw self-center shadow-xl rounded-lg p-10 mt-8 "
    >
      <PaymentElement
        id="payment-element"
        className="mb-8"
        options={paymentElementOptions}
      />
      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="bg-fuchsia-900 hover:bg-fuchsia-950 text-white font-semibold py-2 px-4 rounded-lg shadow-md cursor-pointer transition duration-200 w-full"
      >
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : 'Pay now'}
        </span>
      </button>
      {message && <div id="payment-message">{message} da</div>}
    </form>
  )
}

export default CheckoutForm
