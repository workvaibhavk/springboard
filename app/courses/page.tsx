'use client';

import DNavbar from '@/page_components/DNavbar'
import Footer from '@/page_components/Footer'
import LoadingComponent from '@/page_components/loady'
// import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase';
import { Course } from '@/types';


function parsePostgresArray(pgArray: string | string[] | null | undefined): string[] {
    if (!pgArray) return [];
    if (Array.isArray(pgArray)) return pgArray;

    return pgArray
        .replace(/[{}\[\]"\\]/g, '')
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0); // Remove empty strings
}

export default function Page() {

    const [courses, setCourses] = useState<Course[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedLevel, setSelectedLevel] = useState('All');
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching courses:', error);
        } else {
            console.log(' fetched courses:', data);
            setCourses(data);
        }

        setLoading(false);
    }


    const getFilteredCourses = () => {
        let filtered = courses;

        if (searchTerm) {
            filtered = filtered.filter(course => {
                const searchlower = searchTerm.toLowerCase();
                const titleMatch = course.title.toLowerCase().includes(searchlower);
                const descMatch = course.description.toLowerCase().includes(searchlower);
                return titleMatch || descMatch;
            })
        }

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(course => course.category === selectedCategory);
        }

        if (selectedLevel !== 'All') {
            filtered = filtered.filter(course => course.level === selectedLevel);
        }

        return filtered;

    }


    // Get unique categories from all courses
    const getUniqueCategories = () => {
        const categories = courses.map(course => course.category).filter(Boolean);
        return ['All', ...new Set(categories)];
    };

    // Get unique levels from all courses
    const getUniqueLevels = () => {
        const levels = courses.map(course => course.level).filter(Boolean);
        return ['All', ...new Set(levels)];
    };

    return (
        <div className="">
            <DNavbar />
            <div className="min-h-screen bg-white py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8">All Courses</h1>

                    {loading ? (
                        <LoadingComponent />
                    ) : (
                        <>
                            {/* <DNavbar /> */}

                            {/* Search Bar */}
                            <div className="mb-6">
                                <input
                                    type="text"
                                    placeholder="Search courses by title or description..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#665bca] focus:border-transparent"
                                />
                            </div>
                            {/* Category Filter */}
                            <div className="mb-8">
                                <p className="text-sm font-semibold text-gray-700 mb-2">Category:</p>
                                <div className="flex flex-wrap gap-2">
                                    {getUniqueCategories().map((category) => (
                                        <button
                                            key={`category-${category}`}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`capitalize px-4 py-2 rounded-full font-medium transition-all ${selectedCategory === category
                                                ? 'bg-[#665bca] text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Level Filter */}
                            <div className="mb-8 hidden">
                                <p className="text-sm font-semibold text-gray-700 mb-2">Level:</p>
                                <div className="flex flex-wrap gap-2">
                                    {getUniqueLevels().map((level) => (
                                        <button
                                            key={`level-${level}`}
                                            onClick={() => setSelectedLevel(level)}
                                            className={`capitalize px-4 py-2 rounded-full font-medium transition-all ${selectedLevel === level
                                                ? 'bg-[#665bca] text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Course Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {getFilteredCourses().map((course) => (
                                    <div
                                        key={course.id}
                                        className='course-card w-full border border-gray-200 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300'
                                    >
                                        {/* Thumbnail */}
                                        <div className="aspect-ratio-16-9">
                                            <Image
                                                src={course.thumbnail_url}
                                                alt={course.title}
                                                layout="fill"
                                                objectFit="cover"
                                                className='rounded-t-xl'
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="content flex flex-col justify-between p-4 space-y-3 min-h-[220px]">

                                            {/* Category Badge + Title + Instructor */}
                                            <div className="flex flex-col space-y-1">
                                                <p className='text-sm font-medium text-indigo-700'> {/* Changed to indigo for better contrast */}
                                                    {course.category}
                                                </p>
                                                <p className='font-bold text-xl line-clamp-2 text-gray-800'>
                                                    {course.title}
                                                </p>
                                                <p className='text-gray-500 text-sm'>
                                                    {course.instructor}
                                                </p>
                                            </div>

                                            {/* Tags */}
                                            <div className='flex gap-2 text-xs font-medium flex-wrap mt-2'>
                                                {parsePostgresArray(course.tags).slice(0, 3).map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className='bg-gray-100 py-1 px-3 rounded-full text-gray-600 whitespace-nowrap'
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Duration + Level */}
                                            <div className='font-semibold text-sm text-gray-700 flex items-center pt-2 border-t border-gray-100'>
                                                <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                <span>{Math.floor(course.total_duration_seconds / 3600)}hr {Math.floor((course.total_duration_seconds % 3600) / 60)}min</span>
                                                <span className='mx-2 text-gray-400'>|</span>
                                                <span className='capitalize'>{course.level}</span>
                                            </div>

                                            {/* Button */}
                                            <Link href={`/course/${course.id}`}>
                                                <button
                                                    className='w-full mt-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-colors duration-150 cursor-pointer'
                                                >
                                                    View Course
                                                </button>
                                            </Link>
                                        </div>
                                    </div>


                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}
