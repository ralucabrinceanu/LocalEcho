import React from 'react'
import { toast } from 'react-toastify'
import { redirect, useLoaderData, Form } from 'react-router-dom'
import customFetch from '../utils'

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
  } catch (error) {
    toast.error(error?.response?.data?.msg)
    return error
  }

  return redirect('/events-crud')
}

const EditEvent = () => {
  const { event } = useLoaderData()

  return (
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
        <DateTimeFormRow type="date" name="startDate" label="start date" />
        <DateTimeFormRow type="date" name="endDate" label="end date" />
        <FormSelect
          name="eventCategory"
          label="category"
          defaultValue={event.eventCategory}
          list={Object.values(EventCategory)}
        />

        <div className="col-span-2 text-center">
          <div className="mt-4">
            <SubmitBtn text="ADD" />
          </div>
        </div>
      </Form>
    </section>
  )
}

export default EditEvent
