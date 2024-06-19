import React from 'react'
import { useNavigation } from 'react-router-dom'

const SubmitBtn = ({ text, className, onClick }) => {
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'

  const handleClick = () => {
    if (onClick && !isSubmitting) {
      onClick()
    }
  }

  return (
    <button
      type="submit"
      className={`btn btn-primary btn-block ${className}`}
      disabled={isSubmitting}
      onClick={handleClick}
    >
      {isSubmitting ? (
        <>
          <span className="loading loading-spinner"></span>
          sending...
        </>
      ) : (
        text || 'submit'
      )}
    </button>
  )
}

export default SubmitBtn
