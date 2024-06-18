import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { redirect, useLoaderData } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { CheckoutForm, SectionTitle } from '../components'
import customFetch from '../utils'

export const loader = (store) => () => {
  const user = store.getState().userState.user
  if (!user) {
    toast.warn('You must be logged in to checkout')
    return redirect('/login')
  }

  const cart = store.getState().cartState

  return { user, cart }
}

const stripePromise = loadStripe(
  'pk_test_51PLsLUGw9aMG63JkyLyEvSDLy6mlQrXfDWPwug8YaJLTFqwLiHyez1pmNIkT3RkSoKPkwATtGes4ayK7T7Vu0Kp00088ss1yfJ'
)

const Checkout = () => {
  const { cart } = useLoaderData()
  const totalisim = cart.total

  const [clientSecret, setClientSecret] = useState('')

  const cartTotal = useSelector((state) => state.cartState.total)
  if (cartTotal === 0) {
    return <SectionTitle text="Your cart is empty" />
  }

  useEffect(() => {
    customFetch
      .post('/stripe', { amount: totalisim })
      .then((res) => res.data)
      .then((data) => setClientSecret(data.clientSecret))
  }, [])

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#88199f',
    },
  }
  const options = {
    clientSecret,
    appearance,
  }

  return (
    <>
      <SectionTitle text="place your order" />
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  )
}

export default Checkout
