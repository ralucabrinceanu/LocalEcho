import { toast } from 'react-toastify'
import { EventsContainer, SearchContainer } from '../components'
import customFetch from '../utils/customFetch'
import { useLoaderData } from 'react-router-dom'
import { useContext, createContext } from 'react'

export const loader = async () => {
  try {
    const { data } = await customFetch.get('/events')
    return { data }
  } catch (error) {
    toast.error(error?.response?.data?.msg)
    return error
  }
}

const AllEventsContext = createContext()

const AllEvents = () => {
  const { data } = useLoaderData()

  return (
    <AllEventsContext.Provider value={{ data }}>
      <SearchContainer />
      <EventsContainer />
    </AllEventsContext.Provider>
  )
}

export const useAllEventsContext = () => useContext(AllEventsContext)

export default AllEvents
