import React, { useEffect, useState } from 'react'
import { Form, redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
// import { EventCategory } from '@prisma/client'
import { EventCategory } from '../../../utils/constants'
import {
  FormInput,
  FormSelect,
  HasPermission,
  SubmitBtn,
  DateTimeFormRow,
} from '../components'
import customFetch from '../utils'

export const action = async ({ request }) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  console.log('DATA', data)

  const file = formData.get('image')
  if (file && file.size > 500000) {
    toast.error('Image size too large')
    return null
  }

  try {
    const response = await customFetch.post('/events', formData)
    toast.success('Event added successfully')
    return redirect('/events')
  } catch (error) {
    console.log(error)
    toast.error(error?.response?.data?.msg)
    return null
  }
}

const AddEvents = () => {
  const [venues, setVenues] = useState([])
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await customFetch.get('/venues')
        console.log(response.data.venues)
        if (response.data.venues) {
          setVenues(response.data.venues)
        } else {
          console.error('Invalid venues data format:', response.data)
        }
      } catch (error) {
        console.error('Error fetching venues:', error)
      }
    }
    fetchVenues()
  }, [])

  return (
    <HasPermission requiredRoles={['ADMIN', 'EVENT_PLANNER']}>
      <section className="h-full grid place-items-center">
        <h3 className="text-center text-3xl font-bold">New Event</h3>
        <Form
          method="post"
          className="card grid grid-cols-2 gap-10 p-10 bg-base-100 shadow-lg"
          encType="multipart/form-data"
        >
          <FormInput type="text" name="title" label="event name" />
          <FormInput type="text" name="description" label="description" />
          <DateTimeFormRow type="date" name="startDate" label="start date" />
          <DateTimeFormRow type="date" name="endDate" label="end date" />
          <FormSelect
            name="eventCategory"
            label="category"
            defaultValue={EventCategory.FAMILY_AND_KIDS}
            list={Object.values(EventCategory)}
          />

          <div className="form-control">
            <label htmlFor="venueId" className="label">
              <span className="label-text capitalize">venue</span>
            </label>
            <select name="venueId" className="select select-bordered">
              {venues.map((venue) => {
                return (
                  <option value={venue.id} key={venue.id}>
                    {venue.name}
                  </option>
                )
              })}
            </select>
          </div>

          <label className="form-control">
            <div className="label">
              <span className="label-text capitalize">Select A Photo</span>
            </div>
            <input
              type="file"
              id="image"
              name="image"
              className="file-input file-input-bordered w-full max-w-xs"
              accept="image/*"
            />
          </label>

          <div className="col-span-2 text-center">
            <div className="mt-4">
              <SubmitBtn text="ADD" />
            </div>
          </div>
        </Form>
      </section>
    </HasPermission>
  )
}

export default AddEvents
