import React from 'react'
import { Link, Form, redirect, useLoaderData } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FormInput, HasPermission, SubmitBtn } from '../components'
import customFetch from '../utils'

export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/venues/${params.id}`)
    console.log(data)
    return data
  } catch (error) {
    toast.error(error?.response?.data?.msg)
    return redirect('/')
  }
}

export const action = async ({ request, params }) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  console.log(data)

  if (data.capacity) {
    data.capacity = parseInt(data.capacity, 10)
  }

  try {
    await customFetch.patch(`/venues/${params.id}`, data)
    toast.success('Venue updated successfully')
    return redirect(`/venues`)
  } catch (error) {
    console.log(error)
    toast.error(error?.response?.data?.msg)
    return error
  }
}

const EditVenue = () => {
  const { venue } = useLoaderData()
  console.log(venue)

  return (
    <HasPermission requiredRoles={['ADMIN', 'EVENT_PLANNER']}>
      <>
        <Link to={'/venues'} className="btn btn-active btn-ghost mb-7">
          Back To All Venues
        </Link>

        <section className="h-full grid place-items-center">
          <h3 className="text-center text-3xl font-bold">Edit Venue</h3>
          <Form
            method="post"
            className="card grid grid-cols-2 gap-10 p-10 bg-base-100 shadow-lg"
          >
            <FormInput
              type="text"
              name="name"
              label="name"
              defaultValue={venue.name}
            />
            <FormInput
              type="number"
              name="capacity"
              label="capacity"
              defaultValue={venue.capacity}
            />
            <FormInput
              type="text"
              name="address"
              label="address"
              defaultValue={venue.address}
            />
            <FormInput
              type="text"
              name="city"
              label="city"
              defaultValue={venue.city}
            />
            <FormInput
              type="text"
              name="zipCode"
              label="zip code"
              defaultValue={venue.zipCode}
            />

            <div className="col-span-2 text-center">
              <div className="mt-4">
                <SubmitBtn text="EDIT" />
              </div>
            </div>
          </Form>
        </section>
      </>
    </HasPermission>
  )
}

export default EditVenue
