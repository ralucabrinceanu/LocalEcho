import React from 'react'
import { useState } from 'react'
import { useLoaderData, Link } from 'react-router-dom'
import customFetch from '../utils'
import theatre from '../assets/theatre.jpg'

const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }
  return new Date(dateString).toLocaleString('en-US', options)
}

export const loader = async ({ params }) => {
  const response = await customFetch(`/events/${params.id}`)
  // console.log(response.data.event)
  const event = response.data.event

  const venueResponse = await customFetch(`/venues/${event.venueId}`)
  // console.log(venueResponse.data.venue)
  const venue = venueResponse.data.venue

  return { event, venue }
}

const SingleEvent = () => {
  const { event, venue } = useLoaderData()
  // console.log(event)
  const {
    title,
    description,
    startDate,
    endDate,
    eventCategory,
    eventStatus,
    venueId,
    createdById,
  } = event

  const { name, address } = venue

  return (
    <section>
      <div className="text-md breadcrumbs">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/events">Events</Link>
          </li>
        </ul>
      </div>
      {/* EVENT */}
      <div className="mt-6 grid gap-y-8 lg:grid-cols-2 lg:gap-x-16">
        {/* //TODO image */}
        <img
          src={theatre}
          alt={title}
          className="w-96 h-96 object-cover rounded-lg lg:w-full"
        />
        <div>
          <h1 className="capitalize text-3xl font-bold">{title}</h1>
          <h4 className="text-xl text-neutral-content font-bold mt-2">
            {venue.address}, {venue.name}
          </h4>
          <p className="mt-3 text-xl">
            {formatDate(startDate)} - {formatDate(endDate)}
          </p>
          <p className="mt-6 leading-8">{description}</p>
        </div>
        {/* //TODO btn to tickets */}
      </div>
    </section>
  )
}

export default SingleEvent
