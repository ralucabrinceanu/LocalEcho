import React from 'react'
import customFetch from '../utils'
import { Form, useLoaderData, Link } from 'react-router-dom'
import { HasPermission, PaginationContainer, FormInput } from '../components'
import theatre from '../assets/theatre.jpg'

export const loader = async ({ request }) => {
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ])
  const response = await customFetch.get('/events', { params })
  const events = response.data.events
  const meta = response.data.meta
  return { events, meta, params }
}

const EventsCrud = () => {
  const { meta, params, events } = useLoaderData()
  const { search } = params

  const totalEvents = meta.pagination.totalEvents

  return (
    <HasPermission requiredRoles={['ADMIN', 'EVENT_PLANNER']}>
      <>
        <Form className="bg-base-200 rounded-md px-8 py-4 grid gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center">
          <FormInput
            type="search"
            label="search event"
            name="search"
            size="input-sm"
            defaultValue={search}
          />
          <button type="submit" className="btn btn-primary btn-sm">
            Search
          </button>
          <Link to="/events-crud" className="btn btn-accent btn-sm">
            Reset
          </Link>
        </Form>

        <Link to={'/add-venue'} className="btn glass mt-4 mr-4">
          Add Venue
        </Link>
        <Link to={'/add-event'} className="btn glass mt-4">
          Add Event
        </Link>

        <div>
          {totalEvents === 0 ? (
            <h5 className="text-2xl mt-16">No events matched your search...</h5>
          ) : (
            <>
              <div className="pt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => {
                  const { id, title } = event
                  return (
                    <div
                      key={id}
                      className="card w-full shadow-xl hover:shadow-2xl transition duration-300"
                    >
                      <figure
                        className="px-4 pt-4 cursor-pointer"
                        onClick={() => navigate(`/events/${id}`)}
                      >
                        <img
                          src={theatre}
                          alt={title}
                          className="rounded-xl h-64 md:h-48 w-full object-cover"
                        />
                      </figure>
                      <div className="card-body items-center text-center">
                        <h2
                          className="card-title capitalize tracking-wider"
                          onClick={() => navigate(`/events/${id}`)}
                        >
                          {title}
                        </h2>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Link
                          to={`/edit-event/${id}`}
                          className="btn btn-primary mr-2"
                        >
                          Edit
                        </Link>
                        <Form
                          method="post"
                          action={`/events-crud/delete-event/${id}`}
                        >
                          <button type="submit" className="btn btn-secondary">
                            Delete
                          </button>
                        </Form>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
        <PaginationContainer />
      </>
    </HasPermission>
  )
}

export default EventsCrud
