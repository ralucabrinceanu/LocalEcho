import React, { useEffect, useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaUser } from 'react-icons/fa'
import { MdOutlineEvent } from 'react-icons/md'
import { VscLiveShare } from 'react-icons/vsc'
import { FaCheck } from 'react-icons/fa6'
import { VscFeedback } from 'react-icons/vsc'
import customFetch from '../utils'
import { AdminEventPlanner, ServerError } from '../components'

export const loader = async () => {
  const response = await customFetch.get('/testimonials')
  const testimonials = response.data.testimonials
  console.log(testimonials.length)
  return { testimonials }
}

const Admin = () => {
  const [stats, setStats] = useState({ users: 0, events: 0 })
  const [hasPermission, setHasPermission] = useState(false)
  const { testimonials } = useLoaderData()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await customFetch.get('/users/admin/app-stats')
        setHasPermission(true)
        setStats({
          users: response.data.users,
          completedEvents: response.data.completedEvents,
          scheduledEvents: response.data.scheduledEvents,
          liveEvents: response.data.liveEvents,
        })
      } catch (error) {
        toast.error('You are not authorized to view this page')
      }
    }
    fetchStats()
  }, [])

  return (
    <>
      {hasPermission ? (
        <>
          <div className="stats shadow p-7 ">
            <div className="stat">
              <div className="stat-figure text-indigo-500">
                <FaUser />
              </div>
              <div className="stat-title">Users</div>
              <div className="stat-value">{stats.users}</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-indigo-500">
                <VscLiveShare />
              </div>
              <div className="stat-title">Live</div>
              <div className="stat-value">{stats.liveEvents}</div>
              <div className="stat-desc">Events</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-indigo-500">
                <MdOutlineEvent />
              </div>
              <div className="stat-title">Scheduled</div>
              <div className="stat-value">{stats.scheduledEvents}</div>
              <div className="stat-desc">Events</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-indigo-500">
                <FaCheck />
              </div>
              <div className="stat-title">Completed</div>
              <div className="stat-value">{stats.completedEvents}</div>
              <div className="stat-desc">Events</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-indigo-500">
                <VscFeedback />
              </div>
              <div className="stat-title">Feedback</div>
              <div className="stat-value">{testimonials.length}</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 w-full max-w-4xl mt-7">
            <Link to={'/users'} className="btn btn-outline border-t-indigo-500">
              Users
            </Link>
            <AdminEventPlanner />
          </div>
        </>
      ) : (
        <ServerError />
      )}
    </>
  )
}

export default Admin
