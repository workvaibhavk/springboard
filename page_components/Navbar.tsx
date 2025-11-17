"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'


const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isSignedIn, user } = useUser()

    return (

        <div>

            <nav className='flex w-[100%] md:w-11/12 mx-auto justify-between items-center py-3 md:py-5 left-0 right-0 fixed top-0 bg-white z-50 '>
                <div className='block md:hidden px-4'>
                    <Image
                        src="/brand-mini.png"
                        alt='img'
                        width={55}
                        height={150}
                    />
                </div>
                <div>
                    <Image
                        className='hidden md:flex'
                        src="/brand.png"
                        alt='img'
                        width={220}
                        height={500}
                    />
                </div>




                <div className='hidden md:flex roboto-main font-semibold text-lg gap-10 flex w-120 justify-evenly'>

                    <Link href="/xyz" className='relative text-gray-700 hover:text-black transition-colors duration-300 cursor-pointer group'>
                        About
                        <span className='absolute bottom-0 left-1/2 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full group-hover:left-0'></span>
                    </Link><Link href="/xyz" className='relative text-gray-700 hover:text-black transition-colors duration-300 cursor-pointer group'>
                        Why Us?
                        <span className='absolute bottom-0 left-1/2 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full group-hover:left-0'></span>
                    </Link><Link href="/xyz" className='relative text-gray-700 hover:text-black transition-colors duration-300 cursor-pointer group'>
                        Skills
                        <span className='absolute bottom-0 left-1/2 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full group-hover:left-0'></span>
                    </Link><Link href="/xyz" className='relative text-gray-700 hover:text-black transition-colors duration-300 cursor-pointer group'>
                        Contact
                        <span className='absolute bottom-0 left-1/2 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full group-hover:left-0'></span>
                    </Link>

                </div>

                <div className='hidden md:block'>
                    {isSignedIn ? (
                        <UserButton afterSignOutUrl="/" />
                    ) : (
                        <SignInButton mode="modal" forceRedirectUrl="/authenticate">
                            <button className='relative overflow-hidden bg-[#111111] text-white rounded-full px-6 py-3 transition-all duration-300 cursor-pointer text-[17px] font-medium group'>
                                <span className='relative z-10'>Get Started</span>
                                <span className='absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent'></span>
                            </button>
                        </SignInButton>
                    )}
                </div>

                {/* <SignInButton
                    mode="modal"
                    forceRedirectUrl="/dashboard"
                >
                    <button className='relative overflow-hidden bg-[#111111] text-white rounded-full px-6 py-3 transition-all duration-300 cursor-pointer text-[17px] font-medium group'>
                        <span className='relative z-10'>Get Started</span>
                        <span className='absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent'></span>
                    </button>
                </SignInButton> */}

                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className='block md:hidden px-4'
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

            </nav>
            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className='fixed top-[80px] left-0 right-0 bg-white z-40 md:hidden shadow-lg transition-transform duration-300'>
                    <div className='flex flex-col p-6 gap-4'>
                        <Link onClick={() => setIsMenuOpen(false)} href="/xyz" className='text-gray-700 hover:text-black py-2 border-b border-gray-200'>
                            About
                        </Link>
                        <Link onClick={() => setIsMenuOpen(false)} href="/xyz" className='text-gray-700 hover:text-black py-2 border-b border-gray-200'>
                            Why Us?
                        </Link>
                        <Link onClick={() => setIsMenuOpen(false)} href="/xyz" className='text-gray-700 hover:text-black py-2 border-b border-gray-200'>
                            Skills
                        </Link>
                        <Link onClick={() => setIsMenuOpen(false)} href="/xyz" className='text-gray-700 hover:text-black py-2 border-b border-gray-200'>
                            Contact
                        </Link>
                    </div>
                </div>
            )}

        </div>

    )
}

export default Navbar