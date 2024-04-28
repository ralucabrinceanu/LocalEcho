import React from 'react'
import styled from 'styled-components'
import Wrapper from '../assets/wrappers/LandingPage'
import main from '../assets/images/main.svg'
import { Link } from 'react-router-dom'
import { Logo } from '../components'

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        <div className="info">
          <h1>
            your <span>local</span> events
          </h1>
          <p>
            Gatekeep farm-to-table succulents solarpunk letterpress. +1 viral
            artisan vice pabst cred wayfarers actually hashtag raclette art
            party listicle single-origin coffee ascot neutral milk hotel. Cray
            praxis DIY swag franzen, pop-up kitsch brunch vexillologist hammock
            chillwave viral bicycle rights stumptown. YOLO fam letterpress, kale
            chips 90's kinfolk JOMO poutine truffaut cronut. Lyft vibecession
            succulents PBR&B copper mug glossier.
          </p>
          <Link to="/register" className="btn register-link">
            register
          </Link>
          <Link to="/login" className="btn">
            login / demo user
          </Link>
        </div>
        <img src={main} alt="event hunt" className="img main-img" />
      </div>
    </Wrapper>
  )
}

export default Landing
