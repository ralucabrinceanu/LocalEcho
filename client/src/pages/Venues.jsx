import React from 'react'
import { Link } from 'react-router-dom'
import VenuesList from '../components/VenuesList'
import customFetch from '../utils'

export const loader = async ({ request }) => {
  const response = await customFetch.get('/venues')
  const venues = response.data.venues
  return { venues }
}

const Venues = () => {
  return (
    <>
      <Link to={'/add-venue'} className="btn glass mb-7">
        Add Venues
      </Link>

      <VenuesList />
    </>
  )
}

export default Venues
