import React from 'react'
import { Link } from 'react-router-dom'
import hero1 from '../assets/hero1.jpg'
import hero2 from '../assets/hero2.jpg'
import hero3 from '../assets/hero3.jpg'
import hero4 from '../assets/hero4.jpg'

const carouselImages = [hero1, hero2, hero3, hero4]

const Hero = () => {
  return (
    <div className="grid lg:grid-cols2 gap-24 items-center">
      <div>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl">
          Where Local Vibrations Find Their Echo
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-8">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex commodi
          reprehenderit iusto atque aperiam libero recusandae, error architecto
          rerum dolorum.
        </p>
        <div className="mt-10">
          <Link to="/events" className="btn btn-primary">
            our events
          </Link>
        </div>
      </div>

      <div className="hidden h-[28rem] lg:carousel carousel-center p-4 space-x-4 bg-neutral rounded-box">
        {carouselImages.map((image) => {
          return (
            <div key={image} className="carousel-item">
              <img
                src={image}
                className="rounded-box h-full w-80 object-cover"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Hero
