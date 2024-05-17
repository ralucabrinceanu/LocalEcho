import React from 'react'
import {
  useNavigate,
  useLocation,
  useLoaderData,
  useNavigation,
} from 'react-router-dom'
import { MdNavigateNext } from 'react-icons/md'
import { GrFormPrevious } from 'react-icons/gr'

const PaginationContainer = () => {
  const { meta } = useLoaderData()
  const { currentPage, numOfPages } = meta.pagination

  const pages = Array.from({ length: numOfPages }, (_, index) => {
    return index + 1
  })

  const { search, pathname } = useLocation()
  const navigate = useNavigate()

  const handlePageChange = (pageNumber) => {
    console.log(search)
    console.log(pathname)
    console.log(pageNumber)

    const searchParams = new URLSearchParams(search)
    searchParams.set('page', pageNumber)
    navigate(`${pathname}?${searchParams.toString()}`)
  }

  if (numOfPages < 2) return null

  return (
    <div className="mt-16 flex justify-end">
      <button
        className="btn btn-xs sm:btn-md join-item"
        onClick={() => {
          let prevPage = currentPage - 1
          if (prevPage < 1) prevPage = numOfPages
          handlePageChange(prevPage)
        }}
      >
        <GrFormPrevious /> Prev
      </button>

      {pages.map((pageNumber) => {
        return (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={`btn btn-xs sm:btn-md border-none join-item ${
              pageNumber === currentPage ? 'bg-base-300 border-base-300' : ''
            }`}
          >
            {pageNumber}
          </button>
        )
      })}

      <button
        className="btn btn-xs sm:btn-md join-item"
        onClick={() => {
          let nextPage = currentPage + 1
          if (nextPage > numOfPages) nextPage = 1
          handlePageChange(nextPage)
        }}
      >
        Next <MdNavigateNext />
      </button>
    </div>
  )
}

export default PaginationContainer
