import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import customFetch from '../utils'
// import { clearCart } from '../features/cart/cartSlice'

const CheckoutForm = (props) => {
  const stripe = useStripe()
  const elements = useElements()
  // const dispatch = useDispatch()

  const [message, setMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const cartItems = useSelector((store) => store.cartState.orderItems)
  // console.log(cartItems)

  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search)
  //   const secret = params.get('payment_intent_client_secret')
  //   console.log(secret)
  // }, [stripe])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      console.log('Stripe or elements not loaded')
      return
    }
    setIsLoading(true)

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: 'http://localhost:5173/thankyou',
        },
      })

      if (error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setMessage(error.message)
          console.log('Error message:', error.message)
        } else {
          setMessage('An unexpected error occurred...')
          console.log('Unexpected error:', error)
        }
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        try {
          setMessage('Payment succeeded! Order has been created.')
          // dispatch(clearCart())
        } catch (error) {
          setMessage('Order creation failed...')
        }
      }
    } catch (e) {
      console.log('Exception occurred:', e)
      setMessage('An unexpected error occurred...')
    } finally {
      setIsLoading(false)
    }

    // if (error.type === 'card_error' || error.type === 'validation_error') {
    //   setMessage(error.message)
    // } else {
    //   setMessage('An unexpected error occurred...')
    // }

    // console.log(paymentIntent.status)
    // if (paymentIntent && paymentIntent.status === 'succeeded') {
    //   try {
    //     const items = cartItems.map((item) => ({
    //       amount: item.amount,
    //       ticketId: item.ticketId,
    //     }))
    //     const response = await customFetch.post('/orders', { items })
    //     // console.log(response)
    //     setMessage('Payment succeeded! Order has been created.')
    //     // dispatch(clearCart())
    //   } catch (error) {
    //     setMessage('Order creation failed...')
    //   }
    // }

    // setIsLoading(false)
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
        <span
          id="button-text"
          className="flex justify-center items-center h-full"
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            'Pay now'
          )}
        </span>
      </button>
      {message && <div id="payment-message">{message}</div>}
    </form>
  )
}

export default CheckoutForm
