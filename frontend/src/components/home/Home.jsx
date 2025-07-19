import React from 'react'
import Menu from './menu/Menu'
import About from './about/About'
import Reservation from './reservation/Reservation'
import Service from './services/Service'

const Home = () => {
  return (
    <>
      <About />
      <Reservation />
      <Menu />
      <Service />
    </>
  )
}

export default Home