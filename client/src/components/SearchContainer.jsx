import React from 'react'
import { Form, Link, useSubmit } from 'react-router-dom'
import { EventStatus, EventCategory } from '@prisma/client'
import { FormRow, FormRowSelect, SubmitBtn } from '.'
import Wrapper from '../assets/wrappers/DashboardFormPage'
import { EVENT_SORT_BY } from '../../../utils/constants'
import { useAllEventsContext } from '../pages/AllEvents'

const SearchContainer = () => {
  const { searchValues } = useAllEventsContext()
  const { search, eventStatus, eventCategory, sort } = searchValues
  const submit = useSubmit()

  const debounce = (onChange) => {
    let timeout
    return (e) => {
      const form = e.currentTarget.form
      // console.log(form)
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        onChange(form)
      }, 2000)
    }
  }

  return (
    <Wrapper>
      <Form className="form">
        <h5 className="form-title">search form</h5>
        <div className="form-center">
          <FormRow
            type="search"
            name="search"
            defaultValue={search}
            onChange={debounce((form) => {
              submit(form)
            })}
          />
          <FormRowSelect
            labelText="event status"
            name="eventStatus"
            list={['all', ...Object.values(EventStatus)]}
            defaultValue={eventStatus}
            onChange={(e) => {
              submit(e.currentTarget.form)
            }}
          />
          <FormRowSelect
            labelText="event category"
            name="eventCategory"
            list={['all', ...Object.values(EventCategory)]}
            defaultValue={eventCategory}
            onChange={(e) => {
              submit(e.currentTarget.form)
            }}
          />
          <FormRowSelect
            name="sort"
            defaultValue={sort}
            list={[...Object.values(EVENT_SORT_BY)]}
            onChange={(e) => {
              submit(e.currentTarget.form)
            }}
          />

          <Link to="/dashboard/all-events" className="btn form-btn delete-btn">
            reset search values
          </Link>
        </div>
      </Form>
    </Wrapper>
  )
}

export default SearchContainer
