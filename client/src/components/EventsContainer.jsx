import React from 'react'
import Event from './Event'
import Wrapper from '../assets/wrappers/JobsContainer'
import { useAllEventsContext } from '../pages/AllEvents'
import PageBtnContainer from './PageBtnContainer'

const EventsContainer = () => {
  const { data } = useAllEventsContext()
  // console.log(data)
  const { events, totalEvents, numOfPages } = data
  if (events.length === 0) {
    return (
      <Wrapper>
        <h2>no events to display...</h2>
      </Wrapper>
    )
  }
  return (
    <Wrapper>
      <h5>
        {totalEvents} event{events.length > 1 && 's'}
      </h5>
      <div className="jobs">
        {events.map((event) => {
          return <Event key={event.id} {...event} />
        })}
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  )
}

export default EventsContainer
