const formatISODateForInput = (isoDate) => {
  const date = new Date(isoDate)
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  const hours = ('0' + date.getHours()).slice(-2)
  const minutes = ('0' + date.getMinutes()).slice(-2)
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

const DateTimeFormRow = ({ name, label, defaultValue, size }) => {
  const formattedDefaultValue = defaultValue
    ? formatISODateForInput(defaultValue)
    : ''

  return (
    <label htmlFor={name} className="form-control">
      <div className="label">
        <span className="label-text capitalize">{label}</span>
      </div>
      <input
        type="datetime-local"
        name={name}
        id={name}
        className={`input input-bordered ${size}`}
        defaultValue={formattedDefaultValue}
      />
    </label>
  )
}
export default DateTimeFormRow
