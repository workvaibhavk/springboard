'use client';

import Image from "next/image";

import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CNotFound from '@/page_components/conotfound'
import LoadingComponent from '@/page_components/loady'
import DNavbar from '@/page_components/DNavbar'
import Special from '@/page_components/Special'
// import courseNotFound from '@/page_components/coursenotfound'
// import BackToTopBtn from '@/page_components/backToTopBtn'
import Footer from '@/page_components/Footer'
import { CircleDollarSign, CodeXml, Fingerprint, Sparkles, SplinePointer } from 'lucide-react'
import { Course, CourseEnrollment, EnrollmentData } from "@/types";
import Link from "next/link";
import ResAuthenticate from "@/page_components/resauth";

function parsePostgresArray(pgArray: string | string[] | null | undefined): string[] {
    if (!pgArray) return [];
    if (Array.isArray(pgArray)) return pgArray;

    return pgArray
        .replace(/[{}\[\]"\\]/g, '')
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
}

const Featured = ['5fd8166e-6daf-48a7-8d2b-208df0c94953', '9bda6221-0975-419c-b78e-727083b48382', '26e07fe1-d15d-4eee-a954-69f4c549cb52', '5b1bfba6-107e-44f3-ba84-48b21c5f8531'];

export default function Page() {

    const { user, isLoaded } = useUser();
    // const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [enrolledCourses, setEnrolledCourses] = useState<CourseEnrollment[]>([]);
    const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
    // const [btnLoading, setBtnLoading] = useState(false);


    // const [completedCourses, setCompletedCourses] = useState<CourseEnrollment[]>([]);
    const fetchEnrolledCourses = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/get-user-courses-data');
            if (!response.ok) {
                console.warn(`Server responded with ${response.status}`);
                setEnrolledCourses([]);
                return;
            }
            const data: EnrollmentData = await response.json();
            console.clear();
            console.log('Enrolled Courses:', data);
            setEnrolledCourses(data.userInprogressCourses || []);
            // setCompletedCourses(data.userCompletedCourses);

        } catch (error) {

            console.error('Error fetching enrolled courses:', error);
        }
        finally {
            setLoading(false);
        }
    };

    const fetchFeaturedCourses = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/get-featured-courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ featuredCourseIds: Featured }),
            });
            // const data: EnrollmentData = await response.json();
            const data = await response.json();
            console.log('Featured Courses:', data);
            setFeaturedCourses(data.featuredCourses);
        } catch (error) {
            console.error('Error fetching featured courses:', error);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnrolledCourses();
        fetchFeaturedCourses();
    }, [user, isLoaded]);

    // if (!isLoaded || !user || loading) return <div>Loading...</div>;

    return (
        <div>
            <DNavbar />
            <ResAuthenticate />

            {!isLoaded || !user || loading ?
                <LoadingComponent /> : <div>

                    {/* <div className="animate-spin rounded-full h-12 w-12 border-b-2 p-2 border-[#111111] mx-auto mt-10">
                <Image
                    src="/favicon.ico"
                    height={500}
                    width={500}
                    alt="Loading..." />
            </div> */}

                    <Special />
                    <main className="">
                        <div className='h-[40vh] justify-center items-center flex flex-col gap-6 text-center w-11/12 md:w-10/12 mx-auto mt-32 mb-16'>
                            <h1 className=' text-4xl md:text-5xl capitalize font-medium md:font-semibold'>Which Skill To Conquer Today,  <span className='text-[#665bca] capitalize'> {user?.firstName} </span></h1>

                            <p className='w-9/12 md:w-6/12 text-gray-600'>Join a global community of learners and experts. From foundational concepts to advanced mastery, discover tailored learning paths that empower you to grow at your own pace</p>

                            <div className=' grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-16 grid-flow-dense'>
                                <div className=' flex gap-2 bg-[#E9E9E9] py-1 px-3 rounded-3xl  items-center justify-center text-[#000000d4] '>
                                    <SplinePointer width={20} height={20} />
                                    <span className='font-medium text-sm'>
                                        Design
                                    </span>
                                </div>
                                <div className='flex gap-2 bg-[#E9E9E9] py-1 px-3 rounded-3xl  items-center justify-center text-[#000000d4] '>
                                    <Fingerprint width={20} height={20} />
                                    <span className='font-medium text-sm'>
                                        Cyber Security
                                    </span>
                                </div>
                                <div className='flex gap-2 bg-[#E9E9E9] py-1 px-3 rounded-3xl  items-center justify-center text-[#000000d4] '>
                                    <CircleDollarSign width={20} height={20} />
                                    <span className='font-medium text-sm'>
                                        Business
                                    </span>
                                </div>
                                <div className='flex gap-2 bg-[#E9E9E9] py-1 px-3 rounded-3xl  items-center justify-center text-[#000000d4] '>
                                    <Sparkles width={20} height={20} />
                                    <span className='font-medium text-sm'>
                                        Artificial Intelligence
                                    </span>
                                </div>
                                <div className='flex gap-2 bg-[#E9E9E9] py-1 px-3 rounded-3xl  items-center justify-center text-[#000000d4] '>
                                    <CodeXml width={20} height={20} />
                                    <span className='font-medium text-sm'>
                                        Programming
                                    </span>
                                </div>
                            </div>
                        </div>

                        <section className='w-11/12 md:w-11/12 m-auto'>
                            {/* Courses Section */}
                            <h2 className='text-4xl border-l-4 border-[#665bca] pl-4 font-bold mt-20 mb-8 '>Featured Courses</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {featuredCourses.length > 0 ? (
                                    featuredCourses.map((course) => {
                                        return (
                                            <div
                                                key={course.id}
                                                className='course-card w-full border border-gray-200 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300'
                                            >
                                                {/* Thumbnail */}
                                                <div className="aspect-ratio-16-9">
                                                    <Image
                                                        src={course.thumbnail_url}
                                                        alt={course.title}
                                                        fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                                                    <Link className='w-full mt-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-colors duration-150 cursor-pointer text-center' href={`/course/${course.id}`}>
                                                        Enroll Now
                                                    </Link>
                                                </div>
                                            </div>
                                        )
                                    })) : <CNotFound />}
                            </div>

                            <h2 className='text-4xl border-l-4 border-[#665bca] pl-4 font-bold mt-20 mb-8'>Enrolled Courses</h2>

                            {enrolledCourses.length <= 0 ? <CNotFound /> : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {enrolledCourses && enrolledCourses.map((enrollment) => {
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
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                                                <Link href={`/learn/${course.id}`}
                                                    className='w-full mt-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-colors duration-150 cursor-pointer text-center'
                                                >
                                                    Continue
                                                </Link>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>)}

                            <h2 className='text-3xl md:text-4xl border-l-4 border-[#665bca] pl-4 font-bold mt-14 '>Newly Added Courses</h2>
                            <CNotFound />
                        </section >
                    </main>
                    <Footer />
                </div >
            }
        </div>
    )
}