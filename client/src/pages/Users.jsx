import React from 'react'
import customFetch from '../utils'
import { Form, Link, useLoaderData } from 'react-router-dom'
import { Role } from '@prisma/client'
import { FormInput, FormSelect } from '../components'

export const loader = async ({ request }) => {
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ])
  const response = await customFetch.get('/users/all-users', { params })
  //   console.log(response.data.users)
  const users = response.data.users
  return { users, params }
}

const AllUsers = () => {
  const { users, params } = useLoaderData()
  // console.log(users)
  const { search } = params

  return (
    <>
      <Form className="bg-base-200 rounded-md px-8 py-4 grid gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center">
        <FormInput
          type="search"
          label="Search User"
          name="search"
          size="input-sm"
          defaultValue={search}
        />

        <FormSelect
          label="sort by account creation date"
          name="sort"
          list={['asc', 'desc']}
          defaultValue={params.sort || ''}
          size="select-sm"
        />

        <button type="submit" className="btn btn-primary btn-sm">
          search
        </button>
        <Link to="/all-users" className="btn btn-accent btn-sm">
          reset
        </Link>
      </Form>

      <div className="overflow-x-auto mt-10">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Id</th>
              <th>Email</th>
              <th>Role</th>
              <th>Change Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.email}</td>
                <td>{user.role} </td>

                <td>
                  <button
                    className="btn btn-outline btn-accent"
                    onClick={() =>
                      document.getElementById(`my_modal_${user.id}`).showModal()
                    }
                  >
                    Change
                  </button>
                  <dialog
                    id={`my_modal_${user.id}`}
                    className="modal modal-bottom sm:modal-middle"
                  >
                    <div className="modal-box">
                      <h3 className="font-bold text-lg">
                        Please select another role for: {user.email}
                      </h3>
                      <div className="my-4"></div>

                      <label className="form-control w-full max-w-xs">
                        <select className="select select-accent">
                          {Object.values(Role).map((role, index) => (
                            <option key={index}>{role}</option>
                          ))}
                        </select>
                      </label>

                      <div className="modal-action">
                        <form method="dialog">
                          <button className="btn">Close</button>
                        </form>
                      </div>
                    </div>
                  </dialog>
                </td>

                <td>
                  <Form
                    method="post"
                    action={`/all-users/delete-user/${user.id}`}
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

export default AllUsers
