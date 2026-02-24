'use client'

// import { fetchCourseData } from "@/lib/courseApi";
import DNavbar from "@/page_components/DNavbar";
import Footer from "@/page_components/Footer";
import CNotFound from "@/page_components/conotfound";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
// import { auth } from "@clerk/nextjs/server";
import { useEffect, useState } from "react";
import { Course, EnrollmentData, CourseEnrollment } from '@/types';
import LoadingComponent from '@/page_components/loady'

// export interface Course {
//     id: string;
//     title: string;
//     thumbnail_url: string;
//     category: string;
//     instructor: string;
//     tags: string; // Postgres array as string
//     total_duration_seconds: number;
//     level: string;
// }


function parsePostgresArray(pgArray: string | string[] | null | undefined): string[] {
    if (!pgArray) return [];
    if (Array.isArray(pgArray)) return pgArray;

    return pgArray
        .replace(/[{}\[\]"\\]/g, '')
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0); // Remove empty strings
}

// function parsePostgresArray(pgArray) {
// if (!pgArray) return [];
// if (Array.isArray(pgArray)) return pgArray; // Already an array

// Convert "{ReactJS,C++,Python}" to ["ReactJS", "C++", "Python"]
// return pgArray
// .replace(/[{}]/g, /["]/g, /[[]]/g '') // Remove { and }
// .replace(/[{}"[]\\]/g, '')
// .replace(/[{}\[\]"\\]/g, '')
// .split(',')
// .map(item => item.trim());
// .filter(item => item.length > 0);

// }



export default function Page() {

    const { user, isLoaded } = useUser();
    const [loading, setLoading] = useState(true);
    const [enrolledCourses, setEnrolledCourses] = useState<CourseEnrollment[]>([]);
    const [completedCourses, setCompletedCourses] = useState<CourseEnrollment[]>([]);

    useEffect(() => {
        fetchEnrolledCourses();
        // fetchCompletedCourses();
    }, [user, isLoaded]);

    const fetchEnrolledCourses = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/get-user-courses-data');
            const data: EnrollmentData = await response.json();
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
            <DNavbar />
            {loading ? (
                <LoadingComponent />
            ) : (
                <div className="min-h-screen space-y-6 w-11/12 mx-auto pt-6 pb-10">
                    <div>
                        <h1 className="text-3xl font-bold mb-6 text-gray-800">
                            Continue Learning
                        </h1>


                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {enrolledCourses.length <= 0 ? <CNotFound /> : enrolledCourses.map((enrollment) => {
                                const course: Course = enrollment.courses;
                                return (
                                    <div
                                        key={enrollment.id}
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
                                            <Link href={`/learn/${course.id}`}>
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
                            {completedCourses.length <= 0 ? <CNotFound /> :
                                completedCourses.map((enrollment) => {
                                    const course = enrollment.courses;
                                    return (
                                        <div
                                            key={enrollment.id}
                                            className='flex flex-col md:flex-row course-card w-full border border-gray-200 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300'
                                        >
                                            {/* Thumbnail */}
                                            <div className="p-8 md:w-[300px] md:h-[160px] w-full h-48 relative flex-shrink-0">
                                                <Image
                                                    src={course.thumbnail_url}
                                                    alt={course.title}
                                                    layout="fill"
                                                    objectFit="cover"
                                                    className='rounded-t-xl'
                                                />
                                            </div>

                                            {/* Content */}
                                            <div className="content flex flex-col justify-between p-4 space-y-3 ">

                                                {/* Category Badge + Title + Instructor */}
                                                <div className="flex flex-col space-y-1">
                                                    <p className='text-sm font-medium text-indigo-700'>
                                                        {course.category}
                                                    </p>
                                                    <p className='font-bold text-xl text-gray-800 line-clamp-2'>
                                                        {course.title}
                                                    </p>
                                                    <p className='text-gray-600 text-md'>
                                                        {course.instructor}
                                                    </p>
                                                </div>

                                                {/* Tags */}
                                                <div className='hidden gap-2 text-xs font-medium flex-wrap mt-2'>
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
                                                <div className='hidden font-semibold text-sm text-gray-700  items-center pt-2 border-t border-gray-100'>
                                                    <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    <span>{Math.floor(course.total_duration_seconds / 3600)}hr {Math.floor((course.total_duration_seconds % 3600) / 60)}min</span>
                                                    <span className='mx-2 text-gray-400'>|</span>
                                                    <span className='capitalize'>{course.level}</span>
                                                </div>

                                                {/* Button */}
                                                <Link href={`/certificate/${course.id}`}>
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
            )
            }
            <Footer />
        </div>
    )
}