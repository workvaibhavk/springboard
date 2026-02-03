"use client";
import { ArrowUpNarrowWide } from "lucide-react";
import { useState, useEffect } from 'react';
// import { useRef } from 'react';

export default function BackToTopBtn() {
    // const markerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsVisible(scrollPosition > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div>
            <button className={` bottom-8 right-8 p-3 rounded-full bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition-colors duration-300 ${isVisible ? 'fixed' : 'hidden'}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Back to Top"
            >
                <ArrowUpNarrowWide />
            </button>
        </div>
    )

}