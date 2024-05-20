import React from 'react'
import { Form, Link, redirect, useLoaderData } from 'react-router-dom'
import customFetch from '../utils'
import { toast } from 'react-toastify'
import { FormInput, Header, Navbar, SubmitBtn } from '../components'

// nu stiu daca e bine
export const action = async ({ request }) => {
  const formData = await request.formData()
  const file = formData.get('avatar')
  if (file && file.size > 500000) {
    toast.error('Image size too large')
    return null
  }
  try {
    await customFetch.patch('/users/update-user', formData)
    toast.success('Profile updated successfully')
  } catch (error) {
    toast.error(error?.response?.data?.msg)
  }
  return null
}

const Profile = () => {
  //TODO trebuie sa iei user din loaderdata?, firstName etc

  return (
    <>
      <Navbar />

      <section className="h-full grid place-items-center mt-20">
        <h3 className="text-center text-3xl font-bold">Your Account</h3>
        <Form method="post" className="form mt-7">
          {/* //TODO firstName, lastName, email, avatar  */}

          <label className="form-control ">
            <div className="label">
              <span className="label-text capitalize">add photo</span>
            </div>
            <input
              type="file"
              name="avatar"
              className="file-input file-input-bordered w-full max-w-xs"
            />
          </label>

          <FormInput type="text" name="firstName" label="first name" />
          <FormInput type="text" name="lastName" label="last name" />
          <FormInput type="email" name="email" label="email" />

          <div className="col-span-2 text-center">
            <div className="mt-4">
              <SubmitBtn text="UPDATE ACCOUNT" />
            </div>
          </div>
        </Form>
      </section>
    </>
  )
}

export default Profile
