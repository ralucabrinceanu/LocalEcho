import React from 'react'
import { redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import customFetch from '../utils'

export const action = async ({ params }) => {
  try {
    const ticketResponse = await customFetch.get(`tickets/${params.id}`)
    const eventTicket = await ticketResponse.data.response.id

    await customFetch.delete(`tickets/${params.id}`)
    toast.success('Tickets deleted successfully')

    return redirect(`/admin-ep/${eventTicket}/tickets`)
  } catch (error) {
    toast.error(error?.response?.data?.msg)
    return redirect('/')
  }
}

const DeleteTickets = () => {
  return <div>DELete tickets</div>
}

export default DeleteTickets
