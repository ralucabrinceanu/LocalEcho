import React from 'react'
import { redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import customFetch from '../utils'
import { OrderList, PaginationContainer, SectionTitle } from '../components'

export const loader =
  (store) =>
  async ({ request }) => {
    const user = store.getState().userState.user
    if (!user) {
      toast.warn('You must logged in to view orders')
      return redirect('/login')
    }

    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ])
    console.log('PARAMS', params)

    try {
      const response = await customFetch.get('/orders/showAllMyOrders')
      const orders = response.data.orders
      console.log('ORDERS', orders)
      const meta = response.data.meta
      console.log('META', meta)

      const userResponse = await customFetch.get('/users/all-users')
      const users = userResponse.data.users
      console.log('USERS', users)

      return { orders, meta, params, users }
    } catch (error) {
      const errorMessage = error?.response?.data?.msg
      toast.error(errorMessage)
      return null
    }
  }

const Orders = () => {
  return (
    <>
      <SectionTitle text="Your Orders" />
      <OrderList />
      <PaginationContainer />
    </>
  )
}

export default Orders
