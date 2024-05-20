import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Verify = () => {
  return (
    <>
      <div>
        <h2>Account Confirmed</h2>
        <Link to="/login" className="btn">
          Please Login
        </Link>
      </div>
    </>
  )
}

export default Verify
