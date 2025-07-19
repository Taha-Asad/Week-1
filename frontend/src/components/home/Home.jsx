import React from 'react'
import Menu from './menu/Menu'
import About from './about/About'
import Reservation from './reservation/Reservation'
import Service from './services/Service'
import Blog from './blog/Blog'
import Hero from './hero/Hero'
import UserReservation from './serachReservation/UserReservation'
import Contact from './contact/Contact'

const Home = () => {
  return (
    <>
      <div id="home">
        <Hero />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="reservation">
        <Reservation />
      </div>
      <div id="search-reservation">
        <UserReservation />
      </div>
      <div id="menu">
        <Menu />
      </div>
      <div id="services">
        <Service />
      </div>
      <div id="blog">
        <Blog />
      </div>
      <div id="contact">
        <Contact />
      </div>
    </>
  )
}

export default Home