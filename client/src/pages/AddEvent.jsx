import React from 'react'
import { useState, useEffect } from 'react'
import { Form, redirect, useOutletContext } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  FormRow,
  DateTimeFormRow,
  FormRowSelect,
  SubmitBtn,
} from '../components'
import Wrapper from '../assets/wrappers/DashboardFormPage'
import customFetch from '../utils/customFetch'
import { EventCategory, EventStatus } from '@prisma/client'

export const action = async ({ request }) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  try {
    await customFetch.post('/events', data)
    toast.success('Event added successfully')
  } catch (error) {
    toast.error(error?.response?.data?.msg)
    return error
  }
  return redirect('/dashboard/all-events')
}

const AddEvent = () => {
  const { user } = useOutletContext()

  const [venues, setVenues] = useState([])
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await customFetch.get('/venues')
        // console.log(response)
        if (Array.isArray(response.data)) {
          setVenues(response.data)
        } else if (response.data && response.data.venues) {
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
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">add event</h4>
        <div className="form-center">
          <FormRow type="text" name="title" labelText="title" />
          <FormRow type="text" name="description" labelText="description" />
          <DateTimeFormRow name="startDate" labelText="Start Date" />
          <DateTimeFormRow name="endDate" labelText="End Date" />

          <div className="form-row">
            <label htmlFor="venueId" className="form-label">
              Venue
            </label>
            <select name="venueId" id="venueId" className="form-select">
              {venues.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name}
                </option>
              ))}
            </select>
          </div>

          <FormRowSelect
            name="eventStatus"
            labelText="status"
            defaultValue={EventStatus.SCHEDULED}
            list={Object.values(EventStatus)}
          />
          <FormRowSelect
            name="eventCategory"
            labelText="category"
            defaultValue={EventCategory.FAMILY_AND_KIDS}
            list={Object.values(EventCategory)}
          />

          {/* <div className="form-row">
            <label htmlFor="eventStatus" className="form-label">
              event status
            </label>
            <select
              name="eventStatus"
              id="eventStatus"
              className="form-select"
              defaultValue={EventStatus.SCHEDULED}
            >
              {Object.values(EventStatus).map((itemValue) => {
                return (
                  <option key={itemValue} value={itemValue}>
                    {itemValue}
                  </option>
                )
              })}
            </select>
          </div> */}

          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  )
}

export default AddEvent

// TODO NODEJS: event_planner can add venue, and when add event can only see the venues added by him
