import React from 'react'
import { FormInput, SubmitBtn } from '../components'
import { Form, Link, redirect } from 'react-router-dom'
import customFetch from '../utils'
import { toast } from 'react-toastify'

export const action = async ({ request }) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  // console.log(data)
  try {
    const response = await customFetch.post('/auth/register', data)
    toast.success(
      'account created successfully. please very you email account.'
    )
    return redirect('/login')
  } catch (error) {
    console.log(error.response.data.msg)
    const errorMessage =
      error?.response?.data?.msg || 'please double check your credentials'
    toast.error(errorMessage)
    return null
  }
}

const Register = () => {
  return (
    <section className="h-screen grid place-items-center">
      <Form
        method="post"
        className="card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4"
      >
        <h4 className="text-center text-3xl font-bold">Register</h4>
        <FormInput type="text" label="first name" name="firstName" />
        <FormInput type="text" label="last name" name="lastName" />
        <FormInput type="email" label="email" name="email" />
        <FormInput type="password" label="password" name="password" />

        <div className="mt-4">
          <SubmitBtn text="REGISTER" />
        </div>
        <p className="text-center">
          Already a member?{' '}
          <Link
            to="/login"
            className="ml-2 link link-hover link-primary capitalize"
          >
            Login
          </Link>
        </p>
      </Form>
    </section>
  )
}

export default Register
