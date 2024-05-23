import React from 'react'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { redirect, useLoaderData, Form } from 'react-router-dom'
// import { EventCategory } from '@prisma/client'
import { EventCategory } from '../../../utils/constants'
import customFetch from '../utils'
import {
  FormInput,
  SubmitBtn,
  DateTimeFormRow,
  FormSelect,
  HasPermission,
} from '../components'

export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/events/${params.id}`)
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

  try {
    await customFetch.patch(`/events/${params.id}`, data)
    toast.success('Event updated successfully')
    return redirect(`/events/${params.id}`)
  } catch (error) {
    toast.error(error?.response?.data?.msg)
    return error
  }
}

const EditEvent = () => {
  const { event } = useLoaderData()
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
        <h3 className="text-center text-3xl font-bold">Edit Event</h3>
        <Form
          method="post"
          className="card grid grid-cols-2 gap-10 p-10 bg-base-100 shadow-lg"
        >
          <FormInput
            type="text"
            name="title"
            label="event name"
            defaultValue={event.title}
          />
          <FormInput
            type="text"
            name="description"
            label="description"
            defaultValue={event.description}
          />
          <DateTimeFormRow
            type="date"
            name="startDate"
            label="start date"
            defaultValue={event.startDate}
          />
          <DateTimeFormRow
            type="date"
            name="endDate"
            label="end date"
            defaultValue={event.endDate}
          />
          <FormSelect
            name="eventCategory"
            label="category"
            defaultValue={event.eventCategory}
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

          <div className="col-span-2 text-center">
            <div className="mt-4">
              <SubmitBtn text="EDIT" />
            </div>
          </div>
        </Form>
      </section>
    </HasPermission>
  )
}

export default EditEvent
