import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { SubmitBtn } from '../components'
import customFetch from '../utils'

const AddTestimonial = () => {
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async () => {
    try {
      const response = await customFetch.post('/testimonials', {
        rating,
        content,
      })
      toast.success('Testimonial submitted successfully!')
      setRating(5)
      setContent('')
      navigate('/')
    } catch (error) {
      toast.error(error?.response?.data?.msg)
      return null
    }
  }

  return (
    <>
      <div className="max-w-md mx-auto mb-8">
        <h2 className="mb-4 text-2xl font-semibold text-gray-500">
          Tell us what you think about our app...
        </h2>
        <div className="rating mb-4">
          {[1, 2, 3, 4, 5].map((value) => (
            <input
              key={value}
              type="radio"
              name="rating-2"
              value={value}
              className="mask mask-star-2 bg-orange-400"
              checked={rating === value}
              onChange={() => setRating(value)}
            />
          ))}
        </div>

        <textarea
          className="textarea textarea-info w-96 h-24 mb-4 mt-2"
          placeholder="Write Review"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        <SubmitBtn text="Submit" className="w-96" onClick={handleSubmit} />
      </div>
    </>
  )
}

export default AddTestimonial
