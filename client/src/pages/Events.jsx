import React from 'react'
import { EventsContainer, Filters, PaginationContainer } from '../components'
import customFetch from '../utils'

export const loader = async ({ request }) => {
  const response = await customFetch.get('/events')
  const events = response.data.events
  console.log('EVENTS: ', events)
  const meta = response.data.meta
  console.log('META: ', meta)
  return { events, meta }
}

const Events = () => {
  return (
    <>
      <Filters />
      <EventsContainer />
      <PaginationContainer />
    </>
  )
}

export default Events
