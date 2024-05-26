import React from 'react'
import { toast } from 'react-toastify'
import { Form, redirect } from 'react-router-dom'
import {
  FormInput,
  HasPermission,
  SubmitBtn,
  FormSelect,
  Header,
  Navbar,
} from '../components'
import { TicketType } from '../../../utils/constants'
import customFetch from '../utils'

export const action = async ({ request, params }) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  data.ticketsAvailable = parseInt(data.ticketsAvailable, 10)
  data.price = parseInt(data.price, 10)
  console.log(data)

  try {
    await customFetch.post(`/tickets/${params.id}`, data)
    toast.success('Venue updated successfully')
    return redirect('/events')
  } catch (error) {
    console.log(error)
    toast.error(error?.response?.data?.msg)
    return error
  }
}

const AddTicket = () => {
  const ticketTypeOptions = Object.values(TicketType)

  return (
    <HasPermission requiredRoles={['ADMIN', 'EVENT_PLANNER']}>
      <>
        <Header />
        <Navbar />
        <section className="h-full grid place-items-center mt-10">
          <h3 className="text-center text-3xl font-bold">Create Tickets</h3>
          <Form
            method="post"
            className="card grid grid-cols-1 gap-6 p-10 bg-base-100 shadow-lg"
          >
            <FormSelect
              label="Category"
              name="ticketType"
              list={ticketTypeOptions}
            />

            <FormInput
              type="number"
              name="ticketsAvailable"
              label="Number Of Tickets"
            />

            <FormInput type="number" name="price" label="price" />

            <div className="col-span-2 text-center">
              <div className="mt-4">
                <SubmitBtn text="CREATE" />
              </div>
            </div>
          </Form>
        </section>
      </>
    </HasPermission>
  )
}

export default AddTicket

// TODO buy tickets
