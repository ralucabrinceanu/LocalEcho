import React from 'react'
import { ChartsContainer, StatsContainer } from '../components'
import customFetch from '../utils/customFetch'
import { useLoaderData } from 'react-router-dom'

export const loader = async () => {
  try {
    const response = await customFetch.get('/events/stats')
    return response.data
  } catch (error) {
    return error
  }
}

const Stats = () => {
  const { defaultStats, monthlyEvents } = useLoaderData()

  return (
    <>
      <StatsContainer defaultStats={defaultStats} />
      {monthlyEvents?.length > 1 && <ChartsContainer data={monthlyEvents} />}
    </>
  )
}

export default Stats
