import React, { useState, useEffect } from 'react'
import { Form, redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import customFetch from '../utils'
import { FormInput, SubmitBtn } from '../components'
import defaultAvatar from '../assets/no-photo-user.jpg'
import { updateUser } from '../features/user/userSlice'

export const action = async ({ request }) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  const file = formData.get('avatar')
  if (file && file.size > 500000) {
    toast.error('Image size too large')
    return null
  }
  try {
    const response = await customFetch.patch('/users/update-user', formData)
    const updatedUser = await response.data.user

    const dispatch = useDispatch()
    dispatch(updateUser(updatedUser))

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
  const dispatch = useDispatch()

  const { firstName, lastName, email, avatar } = useSelector(
    (store) => store.userState.user
  )

  useEffect(() => {
    console.log('Profile component re-rendered')
    console.log('User data from Redux:', { firstName, lastName, email })
  }, [firstName, lastName, email])

  const avatarToShow = avatar ? avatar : defaultAvatar

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const file = formData.get('avatar')
    if (file && file.size > 500000) {
      toast.error('Image size too large')
      return
    }
    try {
      const response = await customFetch.patch('/users/update-user', formData)
      const updatedUser = await response.data.user

      dispatch(updateUser(updatedUser))

      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(error?.response?.data?.msg)
    }
  }

  return (
    <>
      <section className="h-full grid place-items-center mt-20">
        <div className="flex items-center justify-center">
          <h3 className="text-center text-3xl font-bold">Your Account</h3>
          <div className="avatar ml-7">
            <div className="w-20 rounded">
              <img src={avatarToShow} alt="avatar" />
            </div>
          </div>
        </div>

        <Form
          method="post"
          className="form mt-7"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
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
