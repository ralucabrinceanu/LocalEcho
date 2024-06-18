import React from 'react'
import { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { BsFillGridFill, BsList } from 'react-icons/bs'
import EventsList from './EventsList'
import EventsGridAll from './EventsGridAll'

const EventsContainer = () => {
  const { meta } = useLoaderData()
  const totalEvents = meta.pagination.totalEvents

  const [layout, setLayout] = useState('grid')

  const setActiveStyles = (pattern) => {
    return `text-xl btn btn-circle btn-sm ${
      pattern === layout
        ? 'btn-primary text-primary-content'
        : 'btn-ghost text-based-content'
    }`
  }

  return (
    <>
      <div className="flex justify-between items-center mt-8 border-b border-base-300 pb-5">
        <h4 className="font-medium text-md">
          {totalEvents} event{totalEvents > 1 && 's'}
        </h4>
        <div className="flex gap-x-2">
          <button
            type="button"
            onClick={() => {
              setLayout('grid')
            }}
            className={setActiveStyles('grid')}
          >
            <BsFillGridFill />
          </button>
          <button
            type="button"
            onClick={() => {
              setLayout('list')
            }}
            className={setActiveStyles('list')}
          >
            <BsList />
          </button>
        </div>
      </div>

      <div>
        {totalEvents === 0 ? (
          <h5 className="text-2xl mt-16">No events matched your search...</h5>
        ) : layout === 'grid' ? (
          <EventsGridAll />
        ) : (
          <EventsList />
        )}
      </div>
    </>
  )
}

export default EventsContainer
