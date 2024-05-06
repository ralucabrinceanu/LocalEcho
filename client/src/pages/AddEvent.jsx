import React from 'react'
import { FormRow, DateTimeFormRow, FormRowSelect } from '../components'
import Wrapper from '../assets/wrappers/DashboardFormPage'
import { Form, useNavigation, useOutletContext } from 'react-router-dom'
import { toast } from 'react-toastify'
import customFetch from '../utils/customFetch'
import { EventCategory, EventStatus } from '@prisma/client'
// import Venue from '@prisma/client'
// console.log(Venue)
// console.log(EventCategory)

const AddEvent = () => {
  const { user } = useOutletContext()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">add event</h4>
        <div className="form-center">
          <FormRow type="text" name="title" labelText="title" />
          <FormRow type="text" name="description" labelText="description" />
          <DateTimeFormRow name="date" labelText="date and time" />

          {/* //TODO */}
          {/* venue id/name */}
          {/* event category */}

          <FormRowSelect
            name="eventStatus"
            labelText="status"
            defaultValue={EventStatus.SCHEDULED}
            list={Object.values(EventStatus)}
          />
          {/* <FormRowSelect
            name="eventCategory"
            labelText="category"
            defaultValue={EventCategory.FAMILY_AND_KIDS}
            list={Object.values(EventCategory)}
          /> */}

          {/* <div className="form-row">
            <label htmlFor="eventStatus" className="form-label">
              event status
            </label>
            <select
              name="eventStatus"
              id="eventStatus"
              className="form-select"
              defaultValue={EventStatus.SCHEDULED}
            >
              {Object.values(EventStatus).map((itemValue) => {
                return (
                  <option key={itemValue} value={itemValue}>
                    {itemValue}
                  </option>
                )
              })}
            </select>
          </div> */}

          <button
            type="submit"
            className="btn btn-block form-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'submitting' : 'submit'}
          </button>
        </div>
      </Form>
    </Wrapper>
  )
}

export default AddEvent
