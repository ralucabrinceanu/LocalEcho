import React, { useEffect, useState } from 'react'
import { Form } from 'react-router-dom'
import { FormInput, FormSelect } from '../components'
import DateTimeFormRow from '../components/DateTimeForm'
import { SubmitBtn } from '../components'
import { EventCategory } from '@prisma/client'
import customFetch from '../utils'
import { toast } from 'react-toastify'

export const action = async ({ request }) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  console.log(data)
  try {
    const response = await customFetch.post('/events', data)
    toast.success('event added successfully')
  } catch (error) {
    console.log(error.response.data.msg)
    const errorMessage = error?.response?.data?.msg
    toast.error(errorMessage)
    return null
  }
}

const AddEvents = () => {
  //! nu gasesc userul
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
    <section className="h-full grid place-items-center">
      <h3 className="text-center text-3xl font-bold">New Event</h3>
      <Form
        method="post"
        className="card grid grid-cols-2 gap-10 p-10 bg-base-100 shadow-lg"
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

        <div className="col-span-2 text-center">
          <div className="mt-4">
            <SubmitBtn text="ADD" />
          </div>
        </div>
      </Form>
    </section>
  )
}

export default AddEvents
