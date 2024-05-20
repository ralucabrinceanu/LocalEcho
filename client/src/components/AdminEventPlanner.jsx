import React from 'react'
import { Link } from 'react-router-dom'

const AdminEventPlanner = () => {
  return (
    <>
      <Link to={'/events-crud'} className="btn btn-outline border-t-indigo-500">
        Events
      </Link>

      <Link to={'/venues'} className="btn btn-outline border-t-indigo-500">
        Venues
      </Link>
    </>
  )
}

export default AdminEventPlanner
