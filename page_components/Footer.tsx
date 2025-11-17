import React from 'react'
import Link from "next/link";
import Image from "next/image";


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas, far, fab)

const Footer = () => {
    return (
        <footer className='mt-10 min-h-[50vh] bg-cover bg-center bg-no-repeat bg-[url("/bg-footer.png")] relative'>
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 to-gray-950/95"></div>

            <div className="relative p-10 lg:p-16 w-full max-w-7xl mx-auto">
                {/* Main Footer Content */}
                <div className="flex flex-col lg:flex-row gap-12 text-white mb-12">
                    {/* Brand Section */}
                    <div className='flex-1 lg:w-3/5 space-y-6'>
                        <Image
                            src="/brand.png"
                            alt='Springboard Logo'
                            width={220}
                            height={500}
                            className="brightness-110"
                        />
                        <p className="text-gray-300 leading-relaxed max-w-md text-sm lg:text-base">
                            Empowering learners worldwide with industry-focused courses, expert mentorship,
                            and career-driven education. Transform your future with Springboard&apos;s proven learning experience.
                        </p>

                        {/* Social Icons */}
                        <div className='flex gap-4 pt-2'>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm">
                                <FontAwesomeIcon className='w-5 h-5 text-white' icon="fa-brands fa-instagram" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-700 flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm">
                                <FontAwesomeIcon className='w-5 h-5 text-white' icon="fa-brands fa-linkedin" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-600 flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm">
                                <FontAwesomeIcon className='w-5 h-5 text-white' icon="fa-brands fa-youtube" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm">
                                <FontAwesomeIcon className='w-5 h-5 text-white' icon="fa-brands fa-facebook" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-sky-500 flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm">
                                <FontAwesomeIcon className='w-5 h-5 text-white' icon="fa-brands fa-twitter" />
                            </Link>
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className='flex flex-wrap lg:flex-nowrap gap-8 lg:gap-12 flex-1 lg:w-2/5'>
                        <div className='flex flex-col space-y-4 min-w-[140px]'>
                            <h4 className="text-lg font-semibold mb-2 text-white">Courses</h4>
                            <Link href="/courses/data-science" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Data Science</Link>
                            <Link href="/courses/software-engineering" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Software Engineering</Link>
                            <Link href="/courses/ui-ux-design" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">UI/UX Design</Link>
                            <Link href="/courses/cybersecurity" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Cybersecurity</Link>
                        </div>

                        <div className='flex flex-col space-y-4 min-w-[140px]'>
                            <h4 className="text-lg font-semibold mb-2 text-white">Company</h4>
                            <Link href="/about" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">About Us</Link>
                            <Link href="/careers" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Careers</Link>
                            <Link href="/blog" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Blog</Link>
                            <Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Contact</Link>
                        </div>

                        <div className='flex flex-col space-y-4 min-w-[140px]'>
                            <h4 className="text-lg font-semibold mb-2 text-white">Support</h4>
                            <Link href="/help" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Help Center</Link>
                            <Link href="/mentorship" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Mentorship</Link>
                            <Link href="/community" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">Community</Link>
                            <Link href="/faq" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">FAQ</Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                    <span className="text-gray-400">© 2025 Springboard. All rights reserved.</span>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</Link>
                        <Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</Link>
                        <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors duration-200">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer