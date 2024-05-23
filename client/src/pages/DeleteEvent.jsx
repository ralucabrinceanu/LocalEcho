import React from 'react'
import customFetch from '../utils'
import { toast } from 'react-toastify'
import { redirect } from 'react-router-dom'

export const action = async ({ params }) => {
  try {
    await customFetch.delete(`events/${params.id}`)
    toast.success('Event deleted successfully')
    return redirect('/events-crud')
  } catch (error) {
    toast.error(error?.response?.data?.msg)
    return redirect('/')
  }
}

const DeleteEvent = () => {
  return <div>delete event</div>
}

export default DeleteEvent
