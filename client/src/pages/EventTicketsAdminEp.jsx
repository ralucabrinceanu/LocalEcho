import React from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { TicketsPerEvent } from '../components'
import customFetch from '../utils'

export const loader = async ({ params }) => {
  const response = await customFetch.get(`/events/${params.id}`)
  const event = response.data.event

  const tickResp = await customFetch.get(`/events/${params.id}/tickets`)
  const tickets = tickResp.data.tickets

  return { event, tickets }
}

const EventTicketsAdminEp = () => {
  const event = useLoaderData()
  const eventId = event.event.id

  return (
    <>
      <Link to={`/add-ticket/${eventId}`} className="btn btn-accent">
        Create Tickets
      </Link>

      <TicketsPerEvent showBuyButton={false} />
    </>
  )
}

export default EventTicketsAdminEp
