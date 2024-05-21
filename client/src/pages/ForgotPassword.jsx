import React from 'react'
import { Form, redirect } from 'react-router-dom'
import { FormInput, SubmitBtn } from '../components'
import customFetch from '../utils'
import { toast } from 'react-toastify'

export const action = async ({ request }) => {
  const formData = await request.formData()
  const email = formData.get('email')
  if (!email) {
    return { errorMessage: 'Please provide a valid email address.' }
  }

  try {
    const response = await customFetch.post('/auth/forgot-password', { email })
    if (!response.ok) {
      throw new Error('Failed to process password reset')
    }
    return redirect('/')
  } catch (error) {
    return { errorMessage: error.message }
  }
}

const ForgotPassword = () => {
  return (
    <section className="h-screen grid place-items-center">
      <Form
        method="POST"
        className="card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4"
      >
        <h4 className="text-center text-3xl font-bold">Add Your Email</h4>
        <FormInput
          type="email"
          label="Email"
          name="email"
          defaultValue="ralu@gmail.com"
        />

        <div className="mt-4">
          <SubmitBtn text="Send" />
        </div>
      </Form>
    </section>
  )
}

export default ForgotPassword
