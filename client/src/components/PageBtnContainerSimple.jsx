import React from 'react'
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import Wrapper from '../assets/wrappers/PageBtnContainer'
import { useAllEventsContext } from '../pages/AllEvents'

const PageBtnContainerSimple = () => {
  const {
    data: { numOfPages, currentPage },
  } = useAllEventsContext()
  //   console.log(numOfPages, currentPage)

  const pages = Array.from({ length: numOfPages }, (_, index) => {
    return index + 1
  })
  //   console.log(pages)

  const { search, pathname } = useLocation()
  const navigate = useNavigate()
  //   console.log('SEARCH: ', search)
  //   console.log('PATHNAME: ', pathname)

  const handlePageChange = (pageNumber) => {
    const searchParams = new URLSearchParams(search)
    searchParams.set('page', pageNumber)
    navigate(`${pathname}?${searchParams.toString()}`)
    // console.log(pageNumber)
  }

  return (
    <Wrapper>
      <button
        className="btn prev-btn"
        onClick={() => {
          let prevPage = currentPage - 1
          if (prevPage < 1) prevPage = numOfPages
          handlePageChange(prevPage)
        }}
      >
        <HiChevronDoubleLeft />
        prev
      </button>
      <div className="btn-container">
        {pages.map((pageNumber) => {
          return (
            <button
              className={`btn page-btn ${
                pageNumber === currentPage && 'active'
              }`}
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          )
        })}
      </div>
      <button
        className="btn next-btn"
        onClick={() => {
          let nextPage = currentPage + 1
          if (nextPage > numOfPages) nextPage = 1
          handlePageChange(nextPage)
        }}
      >
        <HiChevronDoubleRight />
        next
      </button>
    </Wrapper>
  )
}

export default PageBtnContainerSimple
