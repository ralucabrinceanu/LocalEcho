import React from 'react'
import SectionTitle from './SectionTitle'
import EventsGrid from './EventsGrid'

const FeaturedEvents = () => {
  return (
    <div className="pt-24">
      <SectionTitle text="featured events" />
      <EventsGrid />
    </div>
  )
}

export default FeaturedEvents
