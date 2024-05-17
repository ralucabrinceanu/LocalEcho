import React from 'react'
import customFetch from '../utils'
import { toast } from 'react-toastify'
import { redirect } from 'react-router-dom'

export const action = async ({ params }) => {
  try {
    await customFetch.delete(`users/delete-user/${params.id}`)
    toast.success('User deleted successfully')
    return redirect('/all-users')
  } catch (error) {
    toast.error(error?.response?.data?.msg)
    return redirect('/')
  }
}

const DeleteUser = () => {
  return <div>delete user</div>
}

export default DeleteUser
