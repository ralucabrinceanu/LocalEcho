import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../features/user/userSlice'

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.userState.user)

  const handleLogout = () => {
    navigate('/')
    dispatch(logoutUser())
  }

  const handleUpdateProfile = () => {
    navigate('/update-profile')
  }

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : ''

  return (
    <header className="bg-neutral py-2 text-neutral-content">
      <div className="align-element flex justify center sm:justify-end">
        {user ? (
          <div className="flex gap-x-2 sm:gap-x-8 items-center">
            <button
              className="btn btn-xs btn-outline btn-secondary"
              onClick={handleUpdateProfile}
            >
              {initials.toUpperCase()}
            </button>
            <button
              className="btn btn-xs btn-outline btn-primary"
              onClick={handleLogout}
            >
              LOGOUT
            </button>
          </div>
        ) : (
          <div className="flex gap-x-6 justify-center items-center">
            <Link to="/login" className="link link-hover text-xs sm:text-sm">
              Sign in
            </Link>
            <Link to="/register" className="link link-hover text-xs sm:text-sm">
              Create Account
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
