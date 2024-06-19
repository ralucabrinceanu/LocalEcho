import React from 'react'
import { toast } from 'react-toastify'
import { redirect } from 'react-router-dom'
import customFetch from '../utils'

export const action = async ({ params, request }) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  const updatedData = {
    ...data,
    ticketsAvailable: parseInt(data.ticketsAvailable, 10),
    price: parseFloat(data.price),
  }

  try {
    await customFetch.patch(`tickets/${params.id}`, updatedData)
    toast.success('Ticket updated successfully')

    const ticketResponse = await customFetch.get(`tickets/${params.id}`)
    // console.log(ticketResponse.data.response.id)
    const eventTicket = await ticketResponse.data.response.id

    return redirect(`/admin-ep/${eventTicket}/tickets`)
  } catch (error) {
    toast.error(error?.response?.data?.msg)
    return redirect('/')
  }
}

const EditTicket = () => {
  return <div>edit ticket</div>
}

export default EditTicket
