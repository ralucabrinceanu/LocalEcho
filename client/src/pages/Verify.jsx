import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { IoCheckmarkCircleOutline } from 'react-icons/io5'
import customFetch from '../utils'

export const loader = async ({ params }) => {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const verificationToken = urlParams.get('token')
    const email = urlParams.get('email')

    if (!verificationToken || !email) {
      throw new Error('Missing token or email in URL')
    }

    await customFetch.post('/auth/verify-email', { verificationToken, email })
    toast.success('Email Verified')
    return { verified: true }
  } catch (error) {
    console.error(error)
    toast.error(error?.response?.data?.msg || 'Failed to verify email')
    return { verified: false }
  }
}

const Verify = () => {
  useSelector((store) => console.log(store.userState))

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 text-center bg-white rounded-lg shadow-xl max-w-lg w-full">
          <h2 className="text-3xl font-bold text-gray-900">
            Account Confirmed
          </h2>

          <div className="flex items-center justify-center text-green-500 text-9xl mt-6">
            <IoCheckmarkCircleOutline />
          </div>

          <Link to="/login" className="btn btn-success mt-6 text-lg">
            Please Login
          </Link>
        </div>
      </div>
    </>
  )
}

export default Verify
