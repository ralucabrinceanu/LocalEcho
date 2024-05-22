import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Form, redirect, useLoaderData } from 'react-router-dom'
import { FormInput, SubmitBtn } from '../components'
import customFetch from '../utils'

export const loader = async ({ params }) => {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const email = urlParams.get('email')
    return { token, email }
  } catch (error) {
    toast.error(error?.response?.data?.msg)
    return null
  }
}

export const action = async ({ request }) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  try {
    const response = await customFetch.post('/auth/reset-password', data)
    toast.success('Password changed successfully')
    return redirect('/login')
  } catch (error) {
    // console.log(error.response.data.msg)
    const errorMessage = error?.response?.data?.msg
    toast.error(errorMessage)
  }
  return null
}

const ResetPassword = () => {
  const { token, email } = useLoaderData()
  console.log(token, email)
  return (
    <>
      <section className="h-screen grid place-items-center">
        <Form
          method="post"
          className="card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4"
        >
          <h4 className="text-center text-3xl font-bold">Enter new password</h4>
          <FormInput type="password" name="password" />
          <input type="hidden" name="token" value={token} />
          <input type="hidden" name="email" value={email} />
          <SubmitBtn text="reset password" />
        </Form>
      </section>
    </>
  )
}

export default ResetPassword
