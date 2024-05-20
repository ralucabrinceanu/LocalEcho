import React from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import theatre from '../assets/theatre.jpg'
import { EventStatus } from '@prisma/client'

const EventsGridAll = () => {
  const { events } = useLoaderData()

  const formatDate = (dateString) => {
    const options = { month: 'long', day: 'numeric', year: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  const visibleEvents = events.filter(
    (event) => event.eventStatus !== 'COMPLETED'
  )

  return (
    <div className="pt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {visibleEvents.map((event) => {
        const { title, startDate } = event
        return (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className="card w-full shadow-xl hover:shadow-2xl transition duration-300"
          >
            {/* //TODO: add img in events table */}
            <figure className="px-4 pt-4">
              <img
                src={theatre}
                alt={title}
                className="rounded-xl h-64 md:h-48 w-full object-cover"
              />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title capitalize tracking-wider">{title}</h2>
              <span className="text-secondary">{formatDate(startDate)}</span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default EventsGridAll
