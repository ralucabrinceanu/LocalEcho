import React from 'react'
import { toast } from 'react-toastify'
import { redirect } from 'react-router-dom'
import customFetch from '../utils'

export const action = async ({ params, request }) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  // console.log(data)

  try {
    await customFetch.patch(`users/update-user-role/${params.id}`, data)
    toast.success('User role updated successfully')
    return redirect('/users')
  } catch (error) {
    toast.error(error?.response?.data?.msg)
    return redirect('/')
  }
}

const ChangeRole = () => {
  return <div>change role</div>
}

export default ChangeRole
