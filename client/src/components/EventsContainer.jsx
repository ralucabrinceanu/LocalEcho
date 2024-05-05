import React from 'react'
import Event from './Event'
import Wrapper from '../assets/wrappers/JobsContainer'
import { useAllEventsContext } from '../pages/AllEvents'

const EventsContainer = () => {
  const { data } = useAllEventsContext()
  const { events } = data
  if (events.length === 0) {
    return (
      <Wrapper>
        <h2>no events to display...</h2>
      </Wrapper>
    )
  }
  return (
    <Wrapper>
      <div className="jobs">
        {events.map((event) => {
          return <Event key={event.id} {...event} />
        })}
      </div>
    </Wrapper>
  )
}

export default EventsContainer
