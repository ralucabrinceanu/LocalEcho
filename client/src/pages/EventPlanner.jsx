import React from 'react'
import { Link } from 'react-router-dom'
import { HasPermission } from '../components'

const EventPlanner = () => {
  return (
    <HasPermission requiredRoles={['ADMIN', 'EVENT_PLANNER']}>
      <div className="grid grid-cols-4 gap-4 w-full max-w-4xl mt-7">
        <Link
          to={'/events-crud'}
          className="btn btn-outline border-t-indigo-500"
        >
          Events
        </Link>

        <Link to={'/venues'} className="btn btn-outline border-t-indigo-500">
          Venues
        </Link>
      </div>
    </HasPermission>
  )
}

export default EventPlanner
