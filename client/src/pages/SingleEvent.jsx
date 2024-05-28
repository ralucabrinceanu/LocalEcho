import React from 'react'
import { useState } from 'react'
import { useLoaderData, Link } from 'react-router-dom'
import customFetch from '../utils'
import theatre from '../assets/theatre.jpg'

const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }
  const formatOptions = { ...defaultOptions, ...options }
  return new Date(dateString).toLocaleString('en-US', formatOptions)
}

const isSameDay = (start, end) => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  return (
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getDate() === endDate.getDate()
  )
}

const formatEventDate = (startDate, endDate) => {
  if (isSameDay(startDate, endDate)) {
    const startTime = formatDate(startDate, {
      year: undefined,
      month: undefined,
      day: undefined,
    })
    const endTime = formatDate(endDate, {
      year: undefined,
      month: undefined,
      day: undefined,
    })
    return `${formatDate(startDate, {
      hour: undefined,
      minute: undefined,
    })}, ${startTime} - ${endTime}`
  } else {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`
  }
}

export const loader = async ({ params }) => {
  const response = await customFetch.get(`/events/${params.id}`)
  const event = response.data.event

  const venueResponse = await customFetch.get(`/venues/${event.venueId}`)
  const venue = venueResponse.data.venue

  return { event, venue }
}

const SingleEvent = () => {
  const { event, venue } = useLoaderData()
  const {
    id,
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
          <p className="mt-3 text-xl">{formatEventDate(startDate, endDate)}</p>
          <p className="mt-6 leading-8">{description}</p>

          <Link to={`/events/${id}/tickets`} className="btn btn-info mt-5">
            Buy Tickets
          </Link>
        </div>
      </div>
    </section>
  )
}

export default SingleEvent
