'use client'

// import { fetchCourseData } from "@/lib/courseApi";
import DNavbar from "@/page_components/DNavbar";
import Footer from "@/page_components/Footer";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
// import { auth } from "@clerk/nextjs/server";
import { useEffect, useState } from "react";




function parsePostgresArray(pgArray) {
    if (!pgArray) return [];
    if (Array.isArray(pgArray)) return pgArray; // Already an array

    // Convert "{ReactJS,C++,Python}" to ["ReactJS", "C++", "Python"]
    return pgArray
        // .replace(/[{}]/g, /["]/g, /[[]]/g '') // Remove { and }
        // .replace(/[{}"[]\\]/g, '')
        .replace(/[{}\[\]"\\]/g, '')
        .split(',')
        .map(item => item.trim());
    // .filter(item => item.length > 0);

}


export default function Page() {

    const { user, isLoaded } = useUser();
    const [loading, setLoading] = useState(true);
    const [enrolledCourses, setEnrolledCourses] = useState(null);
    const [completedCourses, setCompletedCourses] = useState(null);

    useEffect(() => {
        fetchEnrolledCourses();
        // fetchCompletedCourses();
    }, [user, isLoaded]);

    const fetchEnrolledCourses = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/get-user-courses-data');
            const data = await response.json();
            console.log('Enrolled Courses:', data);
            setEnrolledCourses(data.userInprogressCourses);
            setCompletedCourses(data.userCompletedCourses);

        } catch (error) {

            console.error('Error fetching enrolled courses:', error);
        }
        finally {
            setLoading(false);
        }
    };

    // const fetchCompletedCourses = async () => {
    //     try {
    //         const courses = await fetchCourseData('/api/user/completed-courses');
    //         console.log('Completed Courses:', courses);
    //     } catch (error) {
    //         console.error('Error fetching completed courses:', error);
    //     }
    // };

    return (
        <div>
            {loading ? (
                <div className="">
                    <DNavbar />
                    <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16 mx-auto mb-4"></div>
                            <h2 className="text-xl font-semibold">Loading your courses...</h2>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <DNavbar />
                    <div className="min-h-screen space-y-6 w-11/12 mx-auto pt-6 pb-10">
                        <div>
                            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                                Continue Learning
                            </h1>


                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {enrolledCourses && enrolledCourses.map((course) => {
                                    const ecourse = course.courses;
                                    return (
                                        <div
                                            key={ecourse.id}
                                            className='course-card w-full border border-gray-200 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300'
                                        >
                                            {/* Thumbnail */}
                                            <div className="aspect-ratio-16-9">
                                                <Image
                                                    src={ecourse.thumbnail_url}
                                                    alt={ecourse.title}
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
                                                        {ecourse.category}
                                                    </p>
                                                    <p className='font-bold text-xl line-clamp-2 text-gray-800'>
                                                        {ecourse.title}
                                                    </p>
                                                    <p className='text-gray-500 text-sm'>
                                                        {ecourse.instructor}
                                                    </p>
                                                </div>

                                                {/* Tags */}
                                                <div className='flex gap-2 text-xs font-medium flex-wrap mt-2'>
                                                    {parsePostgresArray(ecourse.tags).slice(0, 3).map((tag, index) => (
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
                                                    <span>{Math.floor(ecourse.total_duration_seconds / 3600)}hr {Math.floor((ecourse.total_duration_seconds % 3600) / 60)}min</span>
                                                    <span className='mx-2 text-gray-400'>|</span>
                                                    <span className='capitalize'>{ecourse.level}</span>
                                                </div>

                                                {/* Button */}
                                                <Link href={`/course/${ecourse.id}`}>
                                                    <button
                                                        className='w-full mt-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-colors duration-150 cursor-pointer'
                                                    >
                                                        Continue
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>




                        </div>
                        <div className=" my-10 pt-10 border-t border-gray-300">
                            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                                Completed Courses
                            </h1>


                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-6">
                                {completedCourses && completedCourses.map((course) => {
                                    const ecourse = course.courses;
                                    return (
                                        <div
                                            key={ecourse.id}
                                            className='flex course-card w-full border border-gray-200 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300'
                                        >
                                            {/* Thumbnail */}
                                            <div className="p-8 w-[300px] h-[160px] relative flex-shrink-0">
                                                <Image
                                                    src={ecourse.thumbnail_url}
                                                    alt={ecourse.title}
                                                    layout="fill"
                                                    objectFit="cover"
                                                    className='rounded-t-xl'
                                                />
                                            </div>

                                            {/* Content */}
                                            <div className="content flex flex-col justify-between p-4 space-y-3 ">

                                                {/* Category Badge + Title + Instructor */}
                                                <div className="flex flex-col space-y-1">
                                                    <p className='text-sm font-medium text-indigo-700'> {/* Changed to indigo for better contrast */}
                                                        {ecourse.category}
                                                    </p>
                                                    <p className='font-bold text-xl text-gray-800 line-clamp-2'>
                                                        {ecourse.title}
                                                    </p>
                                                    <p className='text-gray-600 text-md'>
                                                        {ecourse.instructor}
                                                    </p>
                                                </div>

                                                {/* Tags */}
                                                <div className='hidden gap-2 text-xs font-medium flex-wrap mt-2'>
                                                    {parsePostgresArray(ecourse.tags).slice(0, 3).map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className='bg-gray-100 py-1 px-3 rounded-full text-gray-600 whitespace-nowrap'
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Duration + Level */}
                                                <div className='hidden font-semibold text-sm text-gray-700 flex items-center pt-2 border-t border-gray-100'>
                                                    <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    <span>{Math.floor(ecourse.total_duration_seconds / 3600)}hr {Math.floor((ecourse.total_duration_seconds % 3600) / 60)}min</span>
                                                    <span className='mx-2 text-gray-400'>|</span>
                                                    <span className='capitalize'>{ecourse.level}</span>
                                                </div>

                                                {/* Button */}
                                                <Link href={`/certificate/${ecourse.id}`}>
                                                    <button
                                                        className='w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-colors duration-150 cursor-pointer'
                                                    >
                                                        Get Certificate
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>




                        </div>
                    </div>
                </div>
            )
            }
            <Footer />
        </div>
    )
}