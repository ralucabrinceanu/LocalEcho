import React from 'react'
import SectionTitle from './SectionTitle'
import { FaStar } from 'react-icons/fa'
import { FaRegStar } from 'react-icons/fa'
import { IoIosArrowBack } from 'react-icons/io'
import { IoIosArrowForward } from 'react-icons/io'
import { useState } from 'react'
import testimonialPhoto from '../assets/testimonialUser.jpg'
import { useLoaderData } from 'react-router-dom'

const Testimonials = () => {
  const { testimonials, users } = useLoaderData()
  // console.log(testimonials.length)
  const zeroTestimonial = testimonials.length === 0
  const [current, setCurrent] = useState(0)

  const handlePrev = () => {
    setCurrent(current === 0 ? testimonials.length - 1 : current - 1)
  }

  const handleNext = () => {
    setCurrent(current === testimonials.length - 1 ? 0 : current + 1)
  }

  const renderStars = (rating) => {
    let stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-500 text-2xl" />
        ) : (
          <FaRegStar key={i} className="text-yellow-500 text-2xl" />
        )
      )
    }
    return stars
  }

  const getUserById = (userId) => {
    return users.find((user) => user.id === userId)
  }

  const currentUser = testimonials[current]
  const user = currentUser ? getUserById(currentUser.createdById) : null
  // console.log('CURRENT USER: ', currentUser)
  // const user = getUserById(currentUser.createdById)
  // console.log('USER:', user)

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0).toUpperCase()}.${lastName
      .charAt(0)
      .toUpperCase()}.`
  }

  if (zeroTestimonial) {
    return (
      <div className="pt-24 flex flex-col">
        <SectionTitle text="Testimonials" />
        <p className="text-gray-600 text-lg mt-5">No testimonials available.</p>
      </div>
    )
  }

  return (
    <div className="pt-24 flex flex-col ">
      <SectionTitle text="Testimonials" />

      <div className="relative flex flex-col items-center w-full">
        <button className="absolute left-0 top-1/2 transform -translate-y-1/2 p-4">
          <IoIosArrowBack size={24} onClick={handlePrev} />
        </button>

        <div className="avatar flex items-center justify-center mt-5">
          <div className="w-24 rounded-full">
            {user && user.avatar ? (
              <img src={user.avatar} alt="" />
            ) : (
              <img src={testimonialPhoto} alt="user" />
            )}
          </div>
        </div>

        <div
          className="testimonial-content text-center"
          style={{ maxWidth: '500px', margin: 'auto' }}
        >
          <div className="testimonial-rating m-5 flex items-center justify-center">
            {renderStars(currentUser.rating)}
          </div>
          <p>{currentUser.content}</p>
          <div className="text-xl font-light mt-2">
            {user ? (
              <p>{getInitials(user.firstName, user.lastName)}</p>
            ) : (
              <p>Unknown User</p>
            )}
          </div>
        </div>

        <button className="absolute right-0 top-1/2 transform -translate-y-1/2 p-4">
          <IoIosArrowForward size={24} onClick={handleNext} />
        </button>
      </div>
    </div>
  )
}

export default Testimonials
