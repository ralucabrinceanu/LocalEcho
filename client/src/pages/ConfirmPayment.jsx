import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { loadStripe } from '@stripe/stripe-js'
import { Link, useLocation } from 'react-router-dom'
import { clearCart } from '../features/cart/cartSlice'

const stripePromise = loadStripe(
  'pk_test_51PLsLUGw9aMG63JkyLyEvSDLy6mlQrXfDWPwug8YaJLTFqwLiHyez1pmNIkT3RkSoKPkwATtGes4ayK7T7Vu0Kp00088ss1yfJ'
)

const ConfirmPayment = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const [message, setMessage] = useState('')
  const [paymentSucceeded, setPaymentSucceeded] = useState(false)

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const searchParams = new URLSearchParams(location.search)
      const clientSecret = searchParams.get('payment_intent_client_secret')
      if (!clientSecret) {
        setMessage('No payment intent client secret found.')
        return
      }
      const stripe = await stripePromise
      const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret)
      console.log('PAYMENT INTENT STATUS', paymentIntent.status)

      if (paymentIntent) {
        switch (paymentIntent.status) {
          case 'succeeded':
            setMessage('Payment succeeded!')
            setPaymentSucceeded(true)
            dispatch(clearCart())
            break
          case 'processing':
            setMessage('Your payment is processing.')
            break
          case 'requires_payment_method':
            setMessage('Your payment was not successful, please try again.')
            break
          default:
            setMessage('Something went wrong.')
            break
        }
      }
    }
    checkPaymentStatus()
  }, [location.search, dispatch])

  return (
    <div>
      {paymentSucceeded ? (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-semibold mb-4 text-center">
            Thank you for the order!
          </h1>
          <p className="text-lg text-center">
            Your payment has been successfully confirmed.
          </p>
          <p className="text-lg text-center">
            Please verify your email account for tickets.
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
      ) : (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-semibold mb-4 text-center">
            Payment Status
          </h1>
          <p className="text-lg text-center">{message}</p>
        </div>
      )}
    </div>
  )
}

export default ConfirmPayment
