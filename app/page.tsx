'use client'

import React from 'react'
// import Link from 'next/link'
import Image from 'next/image'
import { MoveRight } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import Navbar from '@/page_components/Navbar'
import Footer from '@/page_components/Footer'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const page = () => {

  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard')
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-2xl text-gray-600'>Loading...</p>
      </div>
    )
  }

  return (
    <div className='overflow-x-hidden'>

      <Navbar />
      {/* <section id='main' className='flex items-center w-10/12 m-auto py-90'> */}
      <section id="main" className="flex flex-col h-[100%] md:flex-row items-center w-11/12 md:w-10/12 m-auto pt-24 pb-24 md:pt-32 md:pb-20 gap-8">
        <div className='w-100 md:w-11/18 flex flex-col gap-[30px] items-center md:items-start'>
          <h1 className='text-[42px] leading-[2.5rem] md:leading-[4rem]  md:text-7xl inter text-gray-900'>Master New Skills
            <br /> with SpringBoard</h1>
          <p className='text-center md:text-start w-11/12 md:w-10/12 text-gray-700'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi quaerat quibusdam, eum, omnis corrupti Iure.</p>

          <div className='flex gap-5'>
            {/* <button className='bg-[#111111] hover:bg-gray-900 transition-colors rounded-full p-5 h-15 flex flex-wrap gap-4 w-auto items-center justify-center content-center cursor-pointer'>
              <span className='text-white text-[17px]'> Get Started </span>
              <div className='p-2 bg-white rounded-full'>
                <MoveRight className="text-black" />
              </div>
            </button> */}

            <button className='flex items-center gap-3 relative overflow-hidden bg-[#111111] text-white rounded-full px-6 py-3 transition-all duration-300 cursor-pointer text-[17px] font-medium group'>
              <span className='relative z-10'>Get Started</span>
              <div className='p-2 bg-white rounded-full'>
                <MoveRight className="text-black" />
              </div>

              <span className='absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent'></span>
            </button>



            <div className="hidden md:flex -space-x-2 items-center">
              <Avatar className='size-12 ring-2 ring-white'>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar className='size-12 ring-2 ring-white'>
                <AvatarImage
                  src="https://github.com/maxleiter.png"
                  alt="@maxleiter"
                />
                <AvatarFallback>LR</AvatarFallback>
              </Avatar>
              <Avatar className='size-12 ring-2 ring-white'>
                <AvatarImage
                  src="https://github.com/evilrabbit.png"
                  alt="@evilrabbit"
                />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
            </div>

            <div className='hidden md:block self-center items-center'>
              <h2 className='text-2xl leading-none font-bold text-gray-900'>42k+</h2>
              <span className="text-gray-600">Enrolled</span>
            </div>
          </div>

          <div className=' hidden md:flex py-[30px] gap-12 items-center'>
            <Image
              src="/partners/1.png"
              alt='img'
              width={110}
              height={70}
              className='h-[100%]'
            />
            <Image
              src="/partners/4.png"
              alt='img'
              width={140}
              height={150}
              className='h-[100%]'
            />
            <Image
              src="/partners/5.png"
              alt='img'
              width={150}
              height={75}
              className='h-[100%]'
            />
          </div>

        </div>

        <div className='flex justify-center w-15/18 md:w-7/18'>
          <Image
            src="/artt.png"
            alt='img'
            width={700}
            height={700}
          />
        </div>
      </section>

      <section id="numbers" className="w-11/12 h-[100%] m-auto ubuntu-bold md:p-4 py-0">
        <h2 className='text-5xl md:text-6xl text-center font-bold pt-5 pb-15 text-gray-900'>Our Growing Community</h2>

        <div className='flex flex-col md:flex-row justify-evenly items-center gap-8'>
          <div>
            <Image
              src="/vcsp/users.png"
              className='bg-[#d4eafa] rounded-[60px] p-4'
              alt='img'
              width={242}
              height={242}
            />
            <div className='self-center items-center flex flex-col'>
              <h2 className='text-2xl leading-none font-bold pt-3 capitalize text-gray-900'>98% learners</h2>
              <span className="text-gray-600">Achieved improvement</span>
            </div>
          </div>

          <div>
            <Image
              src="/vcsp/graph.png"
              className='bg-[#ECC4FF] rounded-[60px] p-4'
              alt='img'
              width={242}
              height={242}
            />
            <div className='self-center items-center flex flex-col'>
              <h2 className='text-2xl leading-none font-bold pt-3 capitalize text-gray-900'>3x growth</h2>
              <span className="text-gray-600">Reported by users</span>
            </div>
          </div>

          <div>
            <Image
              src="/vcsp/time.png"
              className='bg-[#FBD2D2] rounded-[60px] p-4'
              alt='img'
              width={242}
              height={242}
            />
            <div className='self-center items-center flex flex-col'>
              <h2 className='text-2xl leading-none font-bold pt-3 capitalize text-gray-900'>83% course</h2>
              <span className="text-gray-600">Completion rate</span>
            </div>
          </div>

          <div>
            <Image
              src="/vcsp/achievement.png"
              className='bg-[#FDDFA3] rounded-[60px] p-4'
              alt='img'
              width={242}
              height={242}
            />
            <div className='self-center items-center flex flex-col'>
              <h2 className='text-2xl leading-none font-bold pt-3 capitalize text-gray-900'>8M Certificates </h2>
              <span className="text-gray-600">Awarded</span>
            </div>
          </div>
        </div>
      </section>

      <section id='founder-quotes' className='py-10 h-[100%] w-10/12 m-auto ubuntu-bold flex flex-col'>
        <h2 className='text-5xl md:text-6xl text-center font-bold pt-15 pb-10 text-gray-900'>Words From Our Founders</h2>

        <div className='bg-[#d4eafa] w-9/10 md:w-5/10 p-6 rounded-3xl m-4 text-xl text-gray-900'>
          Our emphasis is on the development of people, especially around digital talent at scale, technology for good, diversity and inclusion, and energizing the communities we work in.
          <div className='text-right text-base text-gray-700'>
            <span>-- Salil Parekh</span>
          </div>
        </div>
        <div className='bg-[#FBD2D2] w-9/10 md:w-5/10 p-6 rounded-3xl m-4 self-end text-xl text-gray-900'>
          Infosys will expand reskilling initiatives to empower 10 million plus people with digital skills and 80 million plus lives with technology for good programs in e-governance, healthcare and education.
          <div className='text-right text-base text-gray-700'>
            <span>-- Nandan M. Nilekani</span>
          </div>
        </div>
      </section>

      <Footer />

    </div >
  )
}

export default page