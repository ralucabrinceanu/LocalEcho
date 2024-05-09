import React, { useState, useEffect } from 'react'
import { MdOutlineDescription } from 'react-icons/md'
import { IoLocationSharp, IoStar } from 'react-icons/io5'
import { TbCategory2 } from 'react-icons/tb'
import { Link, Form } from 'react-router-dom'
import Wrapper from '../assets/wrappers/Job'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import isBetween from 'dayjs/plugin/isBetween'
import { EventStatus } from '@prisma/client'
import EventInfo from './EventInfo'

dayjs.extend(advancedFormat)
dayjs.extend(isBetween)

const Event = ({
  id,
  title,
  description,
  startDate,
  endDate,
  eventStatus,
  averageRating,
  eventCategory,
  venueId,
}) => {
  const [status, setStatus] = useState(eventStatus)

  useEffect(() => {
    if (
      eventStatus === EventStatus.CANCELLED ||
      eventStatus === EventStatus.ON_HOLD
    ) {
      setStatus(eventStatus)
    } else {
      const currentDate = dayjs()
      const eventStartDate = dayjs(startDate)
      const eventEndDate = dayjs(endDate)

      if (currentDate.isAfter(eventEndDate)) {
        setStatus(EventStatus.COMPLETED)
      } else if (currentDate.isBetween(eventStartDate, eventEndDate)) {
        setStatus(EventStatus.RIGHT_NOW)
      } else {
        setStatus(EventStatus.SCHEDULED)
      }
    }
  }, [startDate, endDate, eventStatus])

  const eventStartDate = dayjs(startDate).format('MMM Do, YYYY, HH:mm')
  const eventEndDate = dayjs(endDate).format('MMM Do, YYYY, HH:mm')

  let statusClassName
  switch (status) {
    case EventStatus.SCHEDULED:
      statusClassName = 'scheduled'
      break
    case EventStatus.RIGHT_NOW:
      statusClassName = 'right-now'
      break
    case EventStatus.COMPLETED:
      statusClassName = 'completed'
      break
    case EventStatus.CANCELLED:
      statusClassName = 'cancelled'
      break
    case EventStatus.ON_HOLD:
      statusClassName = 'on-hold'
      break
    default:
      statusClassName = ''
  }

  const truncatedDescription = description.slice(0, 40) + '...'

  // console.log(status)

  return (
    <Wrapper>
      <header>
        <div className="main-icon">{title.charAt(0)}</div>
        <div className="info">
          <h5>{title}</h5>
          <p>
            {eventStartDate} - {eventEndDate}
          </p>
        </div>
      </header>
      <div className="content">
        <div className="content-center">
          <EventInfo icon={<IoLocationSharp />} text={'venueName'} />

          <EventInfo
            icon={<TbCategory2 />}
            text={eventCategory.split('_').join(' ').toLowerCase()}
          />
          <EventInfo
            icon={<MdOutlineDescription />}
            text={truncatedDescription}
          />
          <div className={`status ${statusClassName}`}>
            {/* {status.replace('_', ' ')} */}
            {status}
          </div>
        </div>
        <footer className="actions">
          <Link to={`../edit-event/${id}`} className="btn edit-btn">
            Edit
          </Link>
          <Form method="post" action={`/dashboard/delete-event/${id}`}>
            <button type="submit" className="btn delete-btn ">
              Delete
            </button>
          </Form>
        </footer>
      </div>
    </Wrapper>
  )
}

export default Event

// TODO NODEJS + REACT: if completed add averageRating
