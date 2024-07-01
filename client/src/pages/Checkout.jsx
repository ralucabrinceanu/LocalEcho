import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { CheckoutForm } from '../components'
import customFetch, { formatPrice } from '../utils'
import { useSelector } from 'react-redux'

const stripePromise = loadStripe(
  'pk_test_51PLsLUGw9aMG63JkyLyEvSDLy6mlQrXfDWPwug8YaJLTFqwLiHyez1pmNIkT3RkSoKPkwATtGes4ayK7T7Vu0Kp00088ss1yfJ'
)

const Checkout = () => {
  const [clientSecret, setClientSecret] = useState('')

  const orderItems = useSelector((store) => store.cartState.orderItems)
  const total = useSelector((store) => store.cartState.total)

  useEffect(() => {
    const createOrder = async () => {
      try {
        const res = await customFetch.post('/orders', { items: orderItems })
        setClientSecret(res.data.clientSecret)
      } catch (err) {
        console.error('Error creating payment intent: ', err)
      }
    }

    createOrder()
  }, [orderItems])

  const appearance = {
    theme: 'stripe',
  }
  const options = {
    clientSecret,
    appearance,
  }

  return (
    <>
      <h1 className="text-3xl font-bold ">Order Total: {formatPrice(total)}</h1>
      {stripePromise && clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  )
}

export default Checkout
