import React from 'react'
import { Form, useLoaderData, Link } from 'react-router-dom'
import FormInput from './FormInput'
import FormSelect from './FormSelect'
import FormCheckbox from './FormCheckbox'

const Filters = () => {
  const { meta, params } = useLoaderData()
  const { search, rightnow } = params

  return (
    <Form className="bg-base-200 rounded-md px-8 py-4 grid gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center">
      {/* SEARCH */}
      <FormInput
        type="search"
        label="search event"
        name="search"
        size="input-sm"
        defaultValue={search}
      />

      {/* CATEGORIES */}
      <FormSelect
        label="select category"
        name="eventCategory"
        list={meta.categories}
        size="select-sm"
      />

      {/* CITIES */}
      <FormSelect
        label="select city"
        name="city"
        list={meta.cities}
        defaultValue="all"
        size="select-sm"
      />

      {/* RIGHT NOW EVENTS */}
      <FormCheckbox
        label="live events"
        name="rightnow"
        size="checkbox-sm"
        defaultValue={rightnow}
      />

      {/* BUTTONS */}
      <button type="submit" className="btn btn-primary btn-sm">
        search
      </button>
      <Link to="/events" className="btn btn-accent btn-sm">
        reset
      </Link>
    </Form>
  )
}

// TODO range input with capacity
export default Filters
