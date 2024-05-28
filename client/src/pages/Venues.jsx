import React from 'react'
import { Link } from 'react-router-dom'
import customFetch from '../utils'
import VenuesList from '../components/VenuesList'
import { HasPermission } from '../components'

export const loader = async ({ request }) => {
  const response = await customFetch.get('/venues')
  const venues = response.data.venues
  return { venues }
}

const Venues = () => {
  return (
    <HasPermission requiredRoles={['ADMIN', 'EVENT_PLANNER']}>
      <>
        <Link to={'/add-venue'} className="btn glass mb-7">
          Add Venue
        </Link>
        <VenuesList />
      </>
    </HasPermission>
  )
}

export default Venues
