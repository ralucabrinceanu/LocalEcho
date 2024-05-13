import React from 'react'
import { FeaturedEvents, Hero } from '../components'
import customFetch from '../utils'

export const loader = async () => {
  const response = await customFetch.get('/events')
  console.log(response.data.events)
  const events = response.data.events

  return { events }
}

const Landing = () => {
  return (
    <>
      <Hero />
      <FeaturedEvents />
    </>
  )
}

export default Landing
