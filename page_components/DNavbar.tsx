"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, MouseEvent } from 'react';
import { InfoIcon, Menu, Search, X } from 'lucide-react';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import AdditionalInfoPage from "./addInfo";

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
}

interface MobileNavLinkProps {
    href: string;
    children: React.ReactNode;
    onClick: () => void;
}

const DNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const { isSignedIn, user } = useUser();

    // Add a function to handle menu closure for click outside or link navigation
    const closeMenu = (): void => setIsMenuOpen(false);

    const toggleMenu = (): void => setIsMenuOpen(!isMenuOpen);

    return (
        // The outer div should be the container for the entire fixed navbar space
        <div className='w-full'>
            {/* Main Navigation Container: Fixed, full-width, and elevated (z-50) */}
            {/* <nav className='fixed top-0 left-0 right-0 z-50 bg-white shadow-md'> */}
            <nav className='bg-white'>
                {/* Inner Content Container: Centered and constrained width */}
                <div className='flex items-center justify-between w-full max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8'>
                    {/* 1. Logo Section */}
                    <div className='flex items-center space-x-2'>
                        {/* Desktop Logo */}
                        <Link href="/dashboard">
                            <Image
                                className='hidden md:block cursor-pointer'
                                src="/brand.png"
                                alt='Brand Logo'
                                width={180}
                                height={40}
                                priority
                            />
                        </Link>
                        {/* Mobile Logo */}
                        <Link href="/dashboard">
                            <Image
                                className='md:hidden cursor-pointer'
                                src="/brand-mini.png"
                                alt='Brand Mini Logo'
                                width={40}
                                height={40}
                                priority
                            />
                        </Link>
                    </div>

                    {/* 2. Desktop Navigation Links */}
                    <div className='hidden md:flex font-semibold text-base space-x-8 lg:space-x-12'>
                        <NavLink href="/dashboard">Home</NavLink>
                        <NavLink href="/courses">Courses</NavLink>
                        <NavLink href="/user">My Learning</NavLink>
                    </div>

                    {/* 3. Search and User Actions */}
                    <div className='flex items-center space-x-4'>
                        {/* Search Bar (Combined for better structure) */}
                        <div className='hidden lg:flex items-center border border-gray-300 rounded-full px-4 py-2 bg-gray-50 transition-all focus-within:border-indigo-500'>
                            <input
                                type="search"
                                name="Mysearch"
                                id="search"
                                placeholder="Search courses..."
                                className="focus:outline-none bg-gray-50 w-40 text-sm"
                            />
                            <Search className="h-5 w-5 text-gray-500 ml-2 cursor-pointer" />
                        </div>

                        {/* Sign In/User Button */}
                        <div className='hidden md:block'>
                            {isSignedIn ? (
                                <UserButton afterSignOutUrl="/" />
                            ) : (
                                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                                    <button
                                        className='relative overflow-hidden bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 transition-all duration-300 font-semibold text-sm shadow-md'
                                        type="button"
                                    >
                                        Get Started
                                    </button>
                                </SignInButton>
                            )}
                        </div>

                        {/* Mobile Menu Toggle Button */}
                        <button
                            onClick={toggleMenu}
                            className='block md:hidden p-1 text-gray-700 hover:text-black transition-colors'
                            aria-label="Toggle Menu"
                            aria-expanded={isMenuOpen}
                            type="button"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        {isSignedIn && (
                            <button
                                // onClick={toggleMenu}
                                className='block md:hidden text-gray-700 hover:text-black transition-colors'
                                // aria-label="Toggle Menu"
                                // aria-expanded={isMenuOpen}
                                type="button"
                            >
                                <UserButton
                                    afterSignOutUrl="/">

                                    <UserButton.UserProfilePage label="My Profile" labelIcon={<InfoIcon className="h-4 w-4" />} url="additional-info">
                                        <AdditionalInfoPage />
                                    </UserButton.UserProfilePage>
                                </UserButton>
                            </button>)}




                    </div>
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className='fixed top-[56px] sm:top-[64px] left-0 right-0 bg-white z-40 md:hidden shadow-xl border-t border-gray-100'>
                    <div className='flex flex-col p-4'>
                        {/* Search Bar for Mobile */}
                        <div className='flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 mb-4'>
                            <input
                                type="search"
                                placeholder="Search..."
                                className="focus:outline-none bg-gray-50 w-full text-sm"
                            />
                            <Search className="h-5 w-5 text-gray-500 ml-2" />
                        </div>

                        <MobileNavLink href="/dashboard" onClick={closeMenu}>
                            Home
                        </MobileNavLink>
                        <MobileNavLink href="/courses" onClick={closeMenu}>
                            Courses
                        </MobileNavLink>
                        <MobileNavLink href="/user" onClick={closeMenu}>
                            My Learning
                        </MobileNavLink>

                        {/* Mobile Sign In Button */}
                        {!isSignedIn && (
                            <div className="pt-4 mt-4 border-t border-gray-200">
                                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                                    <button
                                        onClick={closeMenu}
                                        className='w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 font-semibold transition-colors text-center'
                                        type="button"
                                    >
                                        Get Started
                                    </button>
                                </SignInButton>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper component for Desktop Nav Links
const NavLink = ({ href, children }: NavLinkProps) => (
    <Link
        href={href}
        className='relative text-gray-700 hover:text-indigo-600 transition-colors duration-200 cursor-pointer group py-2'
    >
        {children}
        <span className='absolute bottom-0 left-1/2 w-0 h-[2px] bg-indigo-600 transition-all duration-300 group-hover:w-full group-hover:left-0'></span>
    </Link>
);

// Helper component for Mobile Nav Links
const MobileNavLink = ({ href, children, onClick }: MobileNavLinkProps) => (
    <Link
        href={href}
        onClick={onClick}
        className='text-gray-700 hover:text-indigo-600 py-3 border-b border-gray-100 text-base font-medium transition-colors'
    >
        {children}
    </Link>
);

export default DNavbar;