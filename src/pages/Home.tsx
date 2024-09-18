import React from 'react'
import Header from '../comps/Header'
import MetaDecorator from '../comps/MetaHeader/MetaDecorator'
import { MdOutlineArrowOutward } from "react-icons/md";

import mockupOne from '../assets/mockups/ulcImg.jpg'
import mockupTwo from '../assets/mockups/oldPort.jpg'

import Marquee from "react-fast-marquee";
import { GoGoal } from "react-icons/go";

const Home: React.FC = () => {

  console.log(import.meta.env.VITE_AUTH_DOMAIN)
  return (
    <div className='relative  bg-[#EDE3E9] h-auto'>
      <Header />
      <MetaDecorator title='TradeTeach | Homepage' description='loremmsss' />


      <div className='h-[auto] relative pt-[100px] flex items-start justify-between gap-9 px-7 mb-[30px] flex-col
               lg:flex-row lg:h-[55vh]'>
        <div className='flex flex-col clampedFontSize boldFontSize'>
          <div className='reducedLineHeight boldFontSize'>MATCH YOUR</div>
          <div className='reducedLineHeight boldFontSize text-[#545863]'>INTERESTS,</div>
          <div className='reducedLineHeight boldFontSize'>LEARN NEW </div>
          <div className='reducedLineHeight boldFontSize text-[#545863]'>SKILLS.</div>
        </div>
        <div className='h-full flex flex-col items-start justify-end ml-auto'>
          <div className='w-full max-w-[full]  mediumFontSize md:max-w-[400px]'>
            Unlock new opportunities through our platform by connecting with diverse skills-building activities available in line with your interests, mastering new hobbies, or advancing your career. Carry out interactive lessons and practice personally while joining a global community of learners.
          </div>
          <div className='text-left gap-3 mt-8 px-5 bg-[#545863] w-auto py-3 rounded-md text-white flex items-center justify-between hover:cursor-pointer'>
            Experience TradeTeach <MdOutlineArrowOutward />
          </div>
        </div>
      </div>

      <div className='overflow-hidden py-3'>
        <Marquee autoFill>
        <div className='pl-2'>Advance Your Career | </div>
          <div className='pl-2'><span className='border-2 boldFontSize px-1 mr-1 rounded-lg border-black'>Master New Skills </span>| </div>

          <div className='pl-2'>Engage in Interactive Learning | </div>
          <div className='pl-2'>Join a Vibrant Community | </div>
          <div className='pl-2'> <span className='border-2 boldFontSize px-1 mr-1 rounded-lg border-black'>Unlock Your Potential</span> |</div>
          <div className='pl-2'>Explore Diverse Opportunities | </div>
        </Marquee>
      </div>

      <div className='text-3xl  h-[50vw] relative  bg-[#545863]'>
        <img src={mockupOne} className='w-full h-full object-cover' />
      </div>
      <div className='h-auto mt-[50px]'>
        <div className='flex flex-col gap-3 px-7 py-5'>
          <div className='text-[3rem] boldFontSize mb-9'>Our Mission</div>
          <div className='flex w-full justify-between gap-7 flex-col md:flex-row'>
            <div className='flex gap-2'>
              <div className='flex flex-col w-full max-w-[200px]'>
                <div className='boldFont font-bold'>Empowering Your Growth</div>
                <div className='text-sm text-[#888]'>Discover opportunities to enhance your personal and professional skills.</div>
              </div>
              <div className='flex flex-col w-full max-w-[200px]'>
                <div className='font-bold'>Transformative Learning</div>
                <div className='text-sm text-[#888]'>Engage in tailored activities designed to help you master new skills and advance your career.</div>
              </div>
            </div>
            <div className='indent-3 w-full max-w-[full] md:max-w-[500px]'>
            Join a community committed to your success and explore a world of interactive and hands-on learning experiences.
            </div>
          </div>
        </div>

        <div className='h-[50vw] relative bg-[#545863]'>
          <img src={mockupTwo} className='w-full h-full object-cover' />
        </div>
      </div>
    </div>
  )
}

export default Home
