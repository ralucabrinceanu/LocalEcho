import React from 'react'
import { Form } from 'react-router-dom'
import { FormInput, SubmitBtn } from '../components'

export const loader = async ({ params }) => {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    console.log(token)
    const email = urlParams.get('email')
    console.log(email)
  } catch (error) {}
  return null
}
// TODO
const ResetPassword = () => {
  return (
    <>
      <section className="h-screen grid place-items-center">
        <Form
          method="post"
          className="card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4"
        >
          <h4 className="text-center text-3xl font-bold">Enter new password</h4>

          <FormInput type="password" name="password" />
        </Form>
      </section>
    </>
  )
}

export default ResetPassword
