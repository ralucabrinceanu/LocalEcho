import React from 'react'
import { Link, useLoaderData, Form } from 'react-router-dom'

const VenuesList = () => {
  const { venues } = useLoaderData()
  console.log(venues)

  return (
    <div className="mt-12 grid gap-y-8 md:grid-cols-2 lg:grid-cols-3 gap-x-6">
      {venues.map((venue) => {
        const { name, capacity, city, address } = venue

        return (
          <div
            key={venue.id}
            className="p-6 rounded-lg flex flex-col shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out bg-transparent border border-red-500 h-full"
          >
            <div className="flex flex-col justify-between h-full">
              <div>
                <h3 className="text-lg font-extrabold text-red-500">{name}</h3>
                <h4 className="text-md font-bold text-gray-600">
                  Capacity: {capacity}
                </h4>
                <p className="text-sm font-semibold text-gray-500">
                  {address}, {city}
                </p>
              </div>

              <div className="mt-5 flex w-full">
                <Link
                  to={`/edit-venue/${venue.id}`}
                  className="btn btn-outline btn-primary w-1/2 mr-2"
                >
                  Edit
                </Link>
                <Form
                  method="post"
                  action={`/venues/delete-venue/${venue.id}`}
                  className="w-1/2"
                >
                  <button
                    type="submit"
                    className="btn btn-outline btn-error w-full"
                  >
                    Delete
                  </button>
                </Form>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default VenuesList
