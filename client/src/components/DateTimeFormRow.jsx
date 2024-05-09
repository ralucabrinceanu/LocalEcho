// import React from 'react'

// const DateTimeFormRow = ({ name, labelText }) => {
//   return (
//     <div className="form-row">
//       <label htmlFor={name} className="form-label">
//         {labelText}
//       </label>
//       <input
//         type="datetime-local"
//         name={name}
//         id={name}
//         className="form-input"
//       />
//     </div>
//   )
// }

const formatISODateForInput = (isoDate) => {
  const date = new Date(isoDate)
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  const hours = ('0' + date.getHours()).slice(-2)
  const minutes = ('0' + date.getMinutes()).slice(-2)
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

const DateTimeFormRow = ({ name, labelText, defaultValue }) => {
  const formattedDefaultValue = defaultValue
    ? formatISODateForInput(defaultValue)
    : ''

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
        defaultValue={formattedDefaultValue}
      />
    </div>
  )
}
export default DateTimeFormRow
