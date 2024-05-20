import React from 'react'
import customFetch from '../utils'
import { toast } from 'react-toastify'
import { redirect } from 'react-router-dom'

export const action = async ({ params }) => {
  try {
    await customFetch.delete(`venues/${params.id}`)
    toast.success('Venue deleted successfully')
  } catch (error) {
    toast.error(error?.response?.data?.msg)
  }
  return redirect('/venues')
}

const DeleteVenue = () => {
  return <div>delete venue</div>
}

export default DeleteVenue
