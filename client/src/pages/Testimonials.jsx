import { useState } from 'react'
import { useLoaderData, Form, Link, useNavigate } from 'react-router-dom'
import customFetch from '../utils'

export const loader = async ({ request }) => {
  const response = await customFetch.get('/testimonials')
  const testimonials = response.data.testimonials

  const usersResponse = await customFetch.get('/users/all-users')
  const users = usersResponse.data.users

  return { testimonials, users }
}

const TestimonialsPage = () => {
  const { testimonials, users } = useLoaderData()
  // console.log(testimonials, users)

  const [rating, setRating] = useState(0)
  const navigate = useNavigate()

  const getUserEmailById = (userId) => {
    const user = users.find((user) => user.id === userId)
    return user ? user.email : 'No email'
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    navigate(`?rating=${rating}`)
  }

  return (
    <>
      <Form className="bg-base-200 rounded-md px-8 py-4 grid gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center">
        {/* //TODO range input */}
        {/* <input
          type="range"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="range"
          step="1"
        />
        <div className="w-full flex justify-between text-xs px-2">
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div> */}

        <button type="submit" className="btn btn-primary btn-sm">
          Search
        </button>
        <Link
          to="/users"
          className="btn btn-accent btn-sm"
          onClick={() => setRating(0)}
        >
          Reset
        </Link>
      </Form>

      <div className="overflow-x-auto mt-7">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th></th>
              <th>Email</th>
              <th>Rating</th>
              <th>Content</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((testimonial, index) => (
              <tr key={testimonial.id}>
                <td>{index + 1}</td>
                <td>{getUserEmailById(testimonial.createdById)}</td>
                <td>{testimonial.rating}</td>
                <td>{testimonial.content}</td>
                <td>
                  <Form
                    method="post"
                    action={`/testimonials/delete-testimonial/${testimonial.id}`}
                  >
                    <button
                      type="submit"
                      className="btn btn-outline btn-secondary"
                    >
                      Delete
                    </button>
                  </Form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default TestimonialsPage
