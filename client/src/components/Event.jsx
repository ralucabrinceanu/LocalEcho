import React from 'react'
import { FaCalendarAlt } from 'react-icons/fa'
import { IoLocationSharp, IoStar } from 'react-icons/io5'
import { TbCategory2 } from 'react-icons/tb'
import { Link, Form } from 'react-router-dom'
import Wrapper from '../assets/wrappers/Job'
import day from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import EventInfo from './EventInfo'
day.extend(advancedFormat)

const Event = ({
  id,
  title,
  description,
  date,
  eventStatus,
  averageRating,
  eventCategory,
}) => {
  //   console.log(eventStatus)
  const eventDate = day(date).format('MMM Do, YYYY, HH:mm')

  let statusClassName
  switch (eventStatus) {
    case 'SCHEDULED':
      statusClassName = 'scheduled'
      break
    case 'IN_PROGRESS':
      statusClassName = 'in-progress'
      break
    case 'COMPLETED':
      statusClassName = 'completed'
      break
    case 'CANCELLED':
      statusClassName = 'cancelled'
      break
    case 'ON_HOLD':
      statusClassName = 'on-hold'
      break
    default:
      statusClassName = ''
  }

  return (
    <Wrapper>
      <header>
        <div className="main-icon">{title.charAt(0)}</div>
        <div className="info">
          {/* <h5>{eventDate}</h5> */}
          <p>{title}</p>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <EventInfo icon={<IoLocationSharp />} text={'!!! ADD VENUE !!!'} />

          <EventInfo
            icon={<TbCategory2 />}
            text={eventCategory.split('_').join(' ').toLowerCase()}
          />
          <EventInfo icon={<FaCalendarAlt />} text={eventDate} />
          <div className={`status ${statusClassName}`}>
            {eventStatus.replace('_', ' ')}
          </div>
        </div>
        <footer className="actions">
          <Link className="btn edit-btn">Edit</Link>
          <Form method="post" action={`/dashboard/delete-event/${id}`}>
            <button type="submit" className="btn delete-btn">
              Delete
            </button>
          </Form>
        </footer>
      </div>
    </Wrapper>
  )
}

export default Event
