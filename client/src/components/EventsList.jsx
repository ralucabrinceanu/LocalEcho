import React from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import theatre from '../assets/theatre.jpg'

const EventsList = () => {
  const { events } = useLoaderData()

  const formatDate = (dateString) => {
    const options = { month: 'long', day: 'numeric', year: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  return (
    <div className="mt-12 grid gap-y-8">
      {events.map((event) => {
        const { title, startDate } = event
        return (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className="p-8 rounded-lg flex flex-col sm:flex-row gap-y-4 flex-wrap bg-base-100 shadow-xl hover:shadow-2xl duration-300 group"
          >
            <img
              src={theatre}
              alt={title}
              className="h-24 w-24 rounded-lg sm:h-32 sm:w-32 object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="ml-0 sm:ml-16">
              <h3 className="capitalize font-medium text-lg">{title}</h3>
              <h4 className="capitalize text-sm text-neutral-content">
                Created by:
              </h4>
            </div>
            <h4 className="font-medium ml-0 sm:ml-auto text-lg">venue_city</h4>
          </Link>
        )
      })}
    </div>
  )
}

export default EventsList
