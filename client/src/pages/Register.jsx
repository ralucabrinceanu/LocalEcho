import React from 'react'
import { Link, Form, redirect, useNavigation } from 'react-router-dom'
import Wrapper from '../assets/wrappers/RegisterAndLoginPage'
import { FormRow, Logo, SubmitBtn } from '../components'
import customFetch from '../utils/customFetch'
import { toast } from 'react-toastify'

export const action = async ({ request }) => {
  const formData = await request.formData()
  // console.log(formData)
  const data = Object.fromEntries(formData)
  // console.log(data)

  try {
    await customFetch.post('/auth/register', data)
    toast.success('Registration Successful')
    return redirect('/login')
  } catch (error) {
    toast.error(error?.response?.data?.msg)
    return error
  }
}

const Register = () => {
  return (
    <Wrapper>
      <Form method="post" className="form">
        <Logo />
        <h4>register</h4>
        <FormRow
          type="text"
          name="firstName"
          labelText="first name"
          defaultValue="ralu"
        />
        <FormRow
          type="text"
          name="lastName"
          labelText="last name"
          defaultValue="bri"
        />
        {/* <FormRow type="text" name="location" defaultValue="bucharest" /> */}
        <FormRow type="email" name="email" defaultValue="ralu@gmail.com" />
        <FormRow type="password" name="password" defaultValue="secret" />
        <SubmitBtn />
        <p>
          Already a member?
          <Link to="/login" className="member-btn">
            Login
          </Link>
        </p>
      </Form>
    </Wrapper>
  )
}

export default Register
