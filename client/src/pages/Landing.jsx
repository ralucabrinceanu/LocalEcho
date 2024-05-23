import React from 'react'
import { FeaturedEvents, Hero, Testimonials } from '../components'
import customFetch from '../utils'

export const loader = async () => {
  const response = await customFetch.get('/events')
  // console.log(response.data.events)
  const events = response.data.events

  const testimonialsResponse = await customFetch.get('/testimonials')
  // console.log(testimonialsResponse.data.testimonials)
  const testimonials = testimonialsResponse.data.testimonials

  const usersResponse = await customFetch.get('/users/all-users')
  const users = usersResponse.data.users
  // console.log(users)

  return { events, testimonials, users }
}

const Landing = () => {
  return (
    <>
      <Hero />
      <FeaturedEvents />
      <Testimonials />
    </>
  )
}

export default Landing
