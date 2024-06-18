import React from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import defaultEventImage from '../assets/no-event-photo.png'

const EventsGrid = () => {
  const { events } = useLoaderData()

  const noEvents = events.length === 0
  if (noEvents) {
    return <p className="text-gray-600 text-lg mt-5">No events available.</p>
  }

  const formatDate = (startDate, endDate) => {
    const options = { month: 'long', day: 'numeric', year: 'numeric' }
    const start = new Date(startDate).toLocaleDateString('en-US', options)
    const end = new Date(endDate).toLocaleDateString('en-US', options)

    if (start === end) {
      return start
    } else {
      return `${start} - ${end}`
    }
  }

  const currentDate = new Date()
  const sortedAndFilteredEvents = events
    .filter((event) => new Date(event.startDate) > currentDate)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 6)

  return (
    <div className="pt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sortedAndFilteredEvents.map((event) => {
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
              <span className="text-secondary">
                {formatDate(startDate, endDate)}
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default EventsGrid
