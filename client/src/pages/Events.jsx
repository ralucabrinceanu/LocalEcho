import React from 'react'
import { EventsContainer, Filters, PaginationContainer } from '../components'
import customFetch from '../utils'

export const loader = async ({ request }) => {
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ])
  console.log('PARAMS: ', params)

  const response = await customFetch.get('/events', { params })
  const events = response.data.events
  console.log('EVENTS: ', events)
  const meta = response.data.meta
  console.log('META: ', meta)
  return { events, meta, params }
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
