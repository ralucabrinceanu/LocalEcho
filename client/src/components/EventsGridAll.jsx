import React from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import defaultEventImage from '../assets/no-event-photo.png'

const EventsGridAll = () => {
  const { events } = useLoaderData()

  const formatDate = (dateString) => {
    const options = { month: 'long', day: 'numeric', year: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  const currentDate = new Date()

  const visibleEvents = events.filter((event) => {
    const eventEndDate = new Date(event.endDate)
    return event.eventStatus !== 'COMPLETED' && eventEndDate >= currentDate
  })

  return (
    <div className="pt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {visibleEvents.map((event) => {
        const { title, startDate, endDate, image } = event
        const eventImage = image || defaultEventImage

        return (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className="card w-full shadow-xl hover:shadow-2xl transition duration-300"
          >
            <figure className="px-4 pt-4">
              <img
                src={eventImage}
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
