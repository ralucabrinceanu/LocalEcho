import React from 'react'
import { toast } from 'react-toastify'
import { SectionTitle, OrderListAdmin } from '../components'
import customFetch from '../utils'

export const loader = async ({ request }) => {
  // const params = Object.fromEntries([
  //   ...new URL(request.url).searchParams.entries(),
  // ])
  // console.log('PARAMS', params)
  try {
    const response = await customFetch.get('/orders')
    const orders = response.data.orders
    // console.log('ORDERS', orders)
    //   const meta = response.data.meta
    //   console.log('META', meta)

    const userResponse = await customFetch.get('/users/all-users')
    const users = userResponse.data.users
    //   console.log('USERS', users)
    return { orders, users }

    //   return { orders, meta, params, users }
  } catch (error) {
    const errorMessage = error?.response?.data?.msg
    toast.error(errorMessage)
    return null
  }
}

const OrdersAdmin = () => {
  return (
    <>
      <SectionTitle text="Orders" />
      <OrderListAdmin />
    </>
  )
}

export default OrdersAdmin
