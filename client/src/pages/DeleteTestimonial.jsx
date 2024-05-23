import React from 'react'
import customFetch from '../utils'
import { redirect } from 'react-router-dom'
import { toast } from 'react-toastify'

export const action = async ({ params }) => {
  try {
    await customFetch.delete(`/testimonials/${params.id}`)
    toast.success('Testimonial deleted successfully')
    return redirect('/testimonials')
  } catch (error) {
    toast.error(error?.response?.data?.msg)
    return redirect('/')
  }
}

const DeleteTestimonial = () => {
  return <div>delete testimonial</div>
}

export default DeleteTestimonial
