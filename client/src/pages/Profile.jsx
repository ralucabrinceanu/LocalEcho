import React from 'react'
import { Form, redirect } from 'react-router-dom'
import customFetch from '../utils'
import { toast } from 'react-toastify'
import { FormInput, Header, Navbar, SubmitBtn } from '../components'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

export const action = async ({ request }) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  console.log(data)

  const file = formData.get('avatar')
  if (file && file.size > 500000) {
    toast.error('Image size too large')
    return null
  }
  try {
    await customFetch.patch('/users/update-user', formData)
    toast.success('Profile updated successfully')
    return redirect('/')
  } catch (error) {
    toast.error(error?.response?.data?.msg)
    return null
  }
}

const Profile = () => {
  //! f imp
  // console.log(useSelector((store) => console.log(store)))

  const { firstName, lastName, email, avatar } = useSelector(
    (store) => store.userState.user
  )

  useEffect(() => {
    console.log('Profile component re-rendered')
    console.log('User data from Redux:', { firstName, lastName, email })
  }, [firstName, lastName, email])

  return (
    <>
      <Header />
      <Navbar />

      <section className="h-full grid place-items-center mt-20">
        <div className="flex items-center justify-center">
          <h3 className="text-center text-3xl font-bold">Your Account</h3>
          <div className="avatar ml-7">
            <div className="w-20 rounded">
              <img src={avatar} alt="avatar" />
            </div>
          </div>
        </div>

        <Form method="post" className="form mt-7" encType="multipart/form-data">
          <label className="form-control ">
            <div className="label">
              <span className="label-text capitalize">Select A Photo</span>
            </div>
            <input
              type="file"
              id="avatar"
              name="avatar"
              className="file-input file-input-bordered w-full max-w-xs"
              accept="image/*"
            />
          </label>

          <FormInput
            type="text"
            name="firstName"
            label="first name"
            defaultValue={firstName}
          />
          <FormInput
            type="text"
            name="lastName"
            label="last name"
            defaultValue={lastName}
          />
          <FormInput
            type="email"
            name="email"
            label="email"
            defaultValue={email}
          />

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
