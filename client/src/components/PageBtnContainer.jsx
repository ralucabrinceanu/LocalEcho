import React from 'react'
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import Wrapper from '../assets/wrappers/PageBtnContainer'
import { useAllEventsContext } from '../pages/AllEvents'

const PageBtnContainer = () => {
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

  const addPageBtn = ({ pageNumber, activeClass }) => {
    return (
      <button
        className={`btn page-btn ${activeClass && 'active'}`}
        key={pageNumber}
        onClick={() => handlePageChange(pageNumber)}
      >
        {pageNumber}
      </button>
    )
  }
  const renderPageBtn = () => {
    const pageBtns = []
    pageBtns.push(addPageBtn({ pageNumber: 1, activeClass: currentPage === 1 }))

    // dots
    if (currentPage > 3) {
      pageBtns.push(
        <span className="page-btn dots" key="dots-1">
          ...
        </span>
      )
    }

    if (currentPage !== 1 && currentPage !== 2) {
      pageBtns.push(
        addPageBtn({
          pageNumber: currentPage - 1,
          activeClass: false,
        })
      )
    }

    // current page
    if (currentPage !== 1 && currentPage !== numOfPages) {
      pageBtns.push(
        addPageBtn({
          pageNumber: currentPage,
          activeClass: true,
        })
      )
    }

    if (currentPage !== numOfPages && currentPage !== numOfPages - 1) {
      pageBtns.push(
        addPageBtn({
          pageNumber: currentPage + 1,
          activeClass: false,
        })
      )
    }

    if (currentPage > numOfPages - 2) {
      pageBtns.push(
        <span className="page-btn dots" key="dots+1">
          ...
        </span>
      )
    }

    pageBtns.push(
      addPageBtn({
        pageNumber: numOfPages,
        activeClass: currentPage === numOfPages,
      })
    )
    return pageBtns
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
      <div className="btn-container">{renderPageBtn()}</div>
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

export default PageBtnContainer
