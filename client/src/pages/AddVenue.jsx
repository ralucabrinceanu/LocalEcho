import React from 'react'
import { Link, redirect, Form } from 'react-router-dom'
import { toast } from 'react-toastify'
import customFetch from '../utils'
import { FormInput, SubmitBtn } from '../components'

export const action = async ({ request }) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  data.capacity = parseInt(data.capacity, 10)
  // console.log(data)
  try {
    const response = await customFetch.post('/venues', data)
    toast.success('Venue added successfully')
    return redirect('/add-event')
  } catch (error) {
    console.log(error)
    const errorMessage = error?.response?.data?.msg
    toast.error(errorMessage)
    return null
  }
}

const AddVenue = () => {
  return (
    <>
      <Link to={'/venues'} className="btn btn-active btn-ghost mb-7">
        Back To All Venues
      </Link>

      <section className="h-full grid place-items-center">
        <h3 className="text-center text-3xl font-bold">Add Venue</h3>
        <Form
          method="post"
          className="card grid grid-cols-2 gap-10 p-10 bg-base-100 shadow-lg"
        >
          <FormInput type="text" name="name" label="name" />
          <FormInput type="number" name="capacity" label="capacity" />
          <FormInput type="text" name="address" label="address" />
          <FormInput type="text" name="city" label="city" />
          <FormInput type="text" name="zipCode" label="zip code" />

          <div className="col-span-2 text-center">
            <div className="mt-4">
              <SubmitBtn text="ADD" />
            </div>
          </div>
        </Form>
      </section>

      {/* name, address, capacity, city, zipCode? */}
    </>
  )
}

export default AddVenue
