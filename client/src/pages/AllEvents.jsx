import { toast } from 'react-toastify'
import { EventsContainer, SearchContainer } from '../components'
import customFetch from '../utils/customFetch'
import { useLoaderData } from 'react-router-dom'
import { useContext, createContext } from 'react'

export const loader = async ({ request }) => {
  // console.log(request.url)
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ])
  // console.log(params)
  try {
    const { data } = await customFetch.get('/events', { params })
    return { data, searchValues: { ...params } }
  } catch (error) {
    toast.error(error?.response?.data?.msg)
    return error
  }
}

const AllEventsContext = createContext()

const AllEvents = () => {
  const { data, searchValues } = useLoaderData()

  return (
    <AllEventsContext.Provider value={{ data, searchValues }}>
      <SearchContainer />
      <EventsContainer />
    </AllEventsContext.Provider>
  )
}

export const useAllEventsContext = () => useContext(AllEventsContext)

export default AllEvents
