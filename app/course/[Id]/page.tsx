"use client"

import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { Course, Module } from '@/types';
// import { Course, EnrollmentData, CourseEnrollment, Module } from '@/types';


function parsePostgresArray(pgArray: string | string[] | null | undefined): string[] {
    if (!pgArray) return [];
    if (Array.isArray(pgArray)) return pgArray;

    return pgArray
        .replace(/[{}\[\]"\\]/g, '')
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0); // Remove empty strings
}

export default function CoursePreviewPage() {
    const params = useParams();
    const courseId = params.Id ?? "";
    const [course, setCourse] = useState<Course | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const { user, isLoaded } = useUser();


    const router = useRouter();

    useEffect(() => {
        if (isLoaded && user) {
            fetchCourseData();
            checkEnrollmentStatus();
        }
    }, [isLoaded, user]);
    // }, [isLoaded, user, courseId]);

    const fetchCourseData = async () => {
        setLoading(true);

        // const { userId } = await auth();


        const { data: courseData, error: courseError } = await supabase
            .from('courses')
            .select('*')
            .eq('id', courseId)
            .single();

        if (courseError) {
            console.error('Error fetching course:', courseError);
            setLoading(false);
            return;
        }

        else {
            setCourse(courseData);
            console.log('Course data:', courseData);
        }

        const { data: modulesData, error: modulesError } = await supabase
            .from('modules')
            .select('*')
            .eq('course_id', courseId)
            .order('order', { ascending: true });

        if (modulesError) {
            console.error('Error fetching modules:', modulesError);
        } else {
            console.log('Modules data:', modulesData);
            setModules(modulesData);
        }

        // In fetchCourseData function, replace the enrollment check with:

        if (user) {
            const { data: enrollmentData, error: enrollmentError } = await supabase
                .from('enrollments')
                .select('*')
                .eq('user_id', user.id) // Make sure this matches what's stored in DB
                .eq('course_id', courseId)
                .maybeSingle();

            console.log('Checking enrollment for user:', user.id); // 🔍 Add this
            console.log('Course ID:', courseId); // 🔍 Add this
            console.log('Enrollment data:', enrollmentData); // 🔍 Add this
            console.log('Enrollment error:', enrollmentError); // 🔍 Add this

            if (enrollmentData) {
                console.log('User is enrolled!');
                setIsEnrolled(true);
            } else {
                console.log('User not enrolled!');
                setIsEnrolled(false);
            }
        }

        setLoading(false);
    }

    const handleEnroll = async () => {

        if (!user) {
            alert("Please sign in to enroll!");
            return;
        }

        if (isEnrolled) {
            router.push(`/learn/${courseId}`);
            return;
        }

        try {
            const response = await fetch('/api/enroll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    courseId: courseId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to enroll');
            }

            console.log('Enrolled successfully!');
            setIsEnrolled(true);
            router.push(`/learn/${courseId}`);

        }

        catch (error) {
            console.error('Enrollment error:', error);
            // alert(error.message || 'Failed to enroll. Please try again.');
        }
    }

    if (!user) return;


    const checkEnrollmentStatus = async () => {

        try {
            const response = await fetch(`/api/check-enrollment?courseId=${courseId}`);
            const data = await response.json();
            console.log('hii', data)

            if (data.isEnrolled) {
                console.log('User is enrolled!');
                setIsEnrolled(true);
            } else {
                console.log('User not enrolled');
                setIsEnrolled(false);
            }
        } catch (error) {
            console.error('Error checking enrollment:', error);
            setIsEnrolled(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#665bca]"></div>
                    </div>
                ) : course ? (

                    <div>
                        {/* Thumbnail and Header Section */}
                        <div className="flex flex-col md:flex-row gap-6 mb-6">
                            {/* Thumbnail */}
                            <div className="md:w-2/5">
                                <div className="aspect-ratio-16-9">
                                    <Image
                                        src={course.thumbnail_url}
                                        alt={course.title}
                                        layout="fill"
                                        objectFit="cover"
                                        className='rounded-xl'
                                    />
                                </div>
                            </div>

                            {/* Course Info */}
                            <div className="md:w-3/5">
                                <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
                                <p className="text-gray-600 mb-2">by {course.instructor}</p>

                                {/* Course Stats */}
                                <div className="flex gap-4 text-sm text-gray-600 mb-4">
                                    <span>📚 {modules.length} Modules</span>
                                    <span>⏱️ {Math.floor(course.total_duration_seconds / 3600)}hr {Math.floor((course.total_duration_seconds % 3600) / 60)}min</span>
                                    <span>📊 {course.level}</span>
                                </div>

                                {/* Category Badge */}
                                <div className="mb-3 hidden">
                                    <span className="inline-block bg-[#00159d] text-white text-sm font-semibold px-4 py-1 rounded-full">
                                        {course.category}
                                    </span>
                                </div>

                                {/* Tags */}
                                <div className='flex gap-2 mb-2'>
                                    {parsePostgresArray(course.tags).slice(0, 3).map((tag, index) => (
                                        <span
                                            key={index}
                                            className='bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] text-sm font-semibold'
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>


                                {/* Enroll Button */}
                                <div className="my-4">
                                    {isEnrolled ? (
                                        <Link href={`/learn/${courseId}`}>
                                            <button className="w-full md:w-auto px-8 py-3 bg-[#665bca] hover:bg-[#5548b8] text-white rounded-2xl font-semibold text-lg transition-colors cursor-pointer">
                                                Continue Learning →
                                            </button>
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={handleEnroll}
                                            className="w-full md:w-auto px-8 py-3 bg-[#665bca] hover:bg-[#5548b8] text-white rounded-2xl font-semibold text-lg transition-colors cursor-pointer"
                                        >
                                            Enroll Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-3">About this course</h2>
                            <p className="text-lg text-gray-700">
                                {course.description || "📝 No description provided for this course."}
                            </p>
                        </div>

                        {/* Module List */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">📚 Course Content ({modules.length} modules)</h2>

                            <div className="space-y-3">
                                {modules.map((module: Module) => (
                                    <div
                                        key={module.id}
                                        className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                                    >
                                        {/* Module Thumbnail */}
                                        <div className="flex-shrink-0">
                                            {/* <div className="aspect-ratio-16-9"> */}
                                            <Image
                                                src={module.thumbnail}
                                                alt={module.title}
                                                width={1280}
                                                height={720}
                                                className="rounded object-cover h-[90px] w-[160px]"
                                            />
                                            {/* </div> */}
                                        </div>

                                        {/* Module Info */}
                                        <div className="flex-grow">
                                            <p className="font-semibold text-gray-900">
                                                {module.order}. {module.title}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {/* {module.duration_seconds} */}
                                                ⏱️  {Math.floor(module.duration_seconds / 60)} min {Math.floor(module.duration_seconds % 60)} sec
                                            </p>
                                        </div>


                                    </div>
                                ))}
                            </div>
                        </div>





                    </div>
                ) : (
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-red-600">Course Not Found</h1>
                        <p className="text-gray-600 mt-4">This course doesn&apos;t exist.</p>
                        <Link
                            href="/courses"
                            className="inline-flex items-center text-[#665bca] hover:text-[#5548b8] mb-6 font-medium"
                        >
                            <ChevronLeft />

                            Back to Courses
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
}