import { useState } from 'react'
import { useLoaderData, Form, Link, useNavigate } from 'react-router-dom'
import customFetch from '../utils'
import { HasPermission } from '../components'

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
    <HasPermission requiredRoles={['ADMIN']}>
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
    </HasPermission>
  )
}

export default TestimonialsPage
