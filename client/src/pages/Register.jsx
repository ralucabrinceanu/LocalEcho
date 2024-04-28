import React from 'react'
import { Link } from 'react-router-dom'
import Wrapper from '../assets/wrappers/RegisterAndLoginPage'
import { FormRow, Logo } from '../components'

const Register = () => {
  return (
    <Wrapper>
      <form className="form">
        <Logo />
        <h4>register</h4>
        <FormRow type="text" name="name" defaultValue="raluca" />
        <FormRow
          type="text"
          name="lastName"
          labelText="last name"
          defaultValue="bri"
        />
        <FormRow type="text" name="location" defaultValue="bucharest" />
        <FormRow
          type="email"
          name="email"
          defaultValue="raluca.brinceanu@s.unibuc.ro"
        />
        <FormRow type="password" name="password" defaultValue="secret123" />

        <button type="submit" className="btn btn-block">
          submit
        </button>
        <p>
          Already a member?
          <Link to="/login" className="member-btn">
            Login
          </Link>
        </p>
      </form>
    </Wrapper>
  )
}

export default Register
