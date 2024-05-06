import React from 'react'

const DateTimeFormRow = ({ name, labelText }) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText}
      </label>
      <input
        type="datetime-local"
        name={name}
        id={name}
        className="form-input"
      />
    </div>
  )
}

export default DateTimeFormRow
