import React from 'react'
import { Link } from 'react-router-dom'

const ServerError = () => {
  return (
    <main className="grid mt-32 place-items-center px-8">
      <div className="text-center">
        <p className="text-9xl font-semibold text-primary">401</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
          Unauthorized
        </h1>
        <p className="mt-6 text-lg leading-7">
          You are not authorized to access this page.
        </p>
        <div className="mt-10">
          <Link to="/" className="btn btn-secondary">
            go back home
          </Link>
        </div>
      </div>
    </main>
  )
}

export default ServerError
