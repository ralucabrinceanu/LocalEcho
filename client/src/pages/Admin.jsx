import React from 'react'
import { FaUserCheck } from 'react-icons/fa'
import { BiCalendarEvent } from 'react-icons/bi'
import { useLoaderData, redirect } from 'react-router-dom'
import customFetch from '../utils/customFetch'
import Wrapper from '../assets/wrappers/StatsContainer'
import { toast } from 'react-toastify'
import { StatItem } from '../components'

export const loader = async () => {
  try {
    const response = await customFetch.get('/users/admin/app-stats')
    return response.data
  } catch (error) {
    toast.error('You are not authorized to view this page')
    return redirect('/dashboard')
  }
}

const Admin = () => {
  const { users, events } = useLoaderData()

  return (
    <Wrapper>
      <StatItem
        title="users"
        count={users}
        color="#e9b949"
        bcg="#fcefc7"
        icon={<FaUserCheck />}
      />
      <StatItem
        title="events"
        count={events}
        color="#647acb"
        bcg="#e8e8f9"
        icon={<BiCalendarEvent />}
      />
    </Wrapper>
  )
}

export default Admin
