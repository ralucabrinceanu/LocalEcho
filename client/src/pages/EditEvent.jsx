import React from 'react'
import {
  FormRow,
  DateTimeFormRow,
  FormRowSelect,
  SubmitBtn,
} from '../components'
import Wrapper from '../assets/wrappers/DashboardFormPage'
import { Form, redirect, useLoaderData, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import customFetch from '../utils/customFetch'
import { EventCategory, EventStatus } from '@prisma/client'
import { useState, useEffect } from 'react'

export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/events/${params.id}`)
    return data
  } catch (error) {
    toast.error(error?.response?.data?.msg)
    return redirect('/dashboard/all-events')
  }
}

// TODO REACT: add venue name and change it !!!

export const action = async ({ request, params }) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  console.log(data)

  try {
    await customFetch.patch(`/events/${params.id}`, data)
    toast.success('Event updated successfully')
  } catch (error) {
    toast.error(error?.response?.data?.msg)
    return error
  }
  return redirect('/dashboard/all-events')
}

const EditEvent = () => {
  const { event } = useLoaderData()

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">edit event</h4>
        <div className="form-center">
          <FormRow
            type="text"
            name="title"
            labelText="title"
            defaultValue={event.title}
          />
          <FormRow
            type="text"
            name="description"
            labelText="description"
            defaultValue={event.description}
          />
          <DateTimeFormRow
            name="startDate"
            labelText="Start Date"
            defaultValue={event.startDate}
          />
          <DateTimeFormRow
            name="endDate"
            labelText="End Date"
            defaultValue={event.endDate}
          />

          <FormRowSelect
            name="eventStatus"
            labelText="status"
            defaultValue={event.eventStatus}
            list={Object.values(EventStatus)}
          />
          <FormRowSelect
            name="eventCategory"
            labelText="category"
            defaultValue={event.eventCategory}
            list={Object.values(EventCategory)}
          />

          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  )
}

export default EditEvent
