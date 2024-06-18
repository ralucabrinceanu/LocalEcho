import React from 'react'
import { Link } from 'react-router-dom'

const AdminEventPlanner = () => {
  return (
    <>
      <Link to={'/venues'} className="btn btn-outline border-t-indigo-500">
        Venues
      </Link>

      <Link
        to={'/testimonials'}
        className="btn btn-outline border-t-indigo-500"
      >
        Feedback
      </Link>
      <Link to="/orders"></Link>
    </>
  )
}

export default AdminEventPlanner
