"use client"

import { useUser } from '@clerk/nextjs';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';

export default function Page() {

    const params = useParams();
    const courseId = params.id
    const { user, isLoaded } = useUser();

    const [certificate, setCertificate] = useState(null)
    const [course, setCourse] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    // const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (isLoaded && user) {
            fetchCertificate()
        }
    }, [courseId, user, isLoaded])

    const fetchCertificate = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`/api/get-certificate?courseId=${courseId}`)
            const data = await response.json()

            if (!response.ok) {
                // throw new Error(data.error || 'Failed to get certificate')
                // setErrorMessage(data.error || 'Failed to get certificate')
                setError(data)
                return;
            }

            setCertificate(data.certificate)
            setCourse(data.course)
        }

        catch (error) {
            console.error('Error fetching certificate:', error)
            setError({ error: error.message })
        }

        finally {
            setLoading(false)
        }
    }

    return (


        <div>

            <style jsx global>{`
@media print {
        body * {
            visibility: hidden;
        }
        #certificate, #certificate * {
            visibility: visible;
        }
        #certificate {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
        }
        nav, header, footer, button {
            display: none !important;
        }
    }
`}</style>

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
                <div className="max-w-5xl mx-auto">
                    <Link
                        href={`/learn/${courseId}`}
                        className="inline-flex items-center text-[#665bca] hover:text-[#5548b8] mb-6 font-medium"
                    >
                        <ChevronLeft />
                        Back to Course
                    </Link>

                    {loading ? (
                        <div className="flex justify-center items-center h-96">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#665bca]"></div>
                        </div>
                    ) : error ? (
                        <div className=" rounded-lg shadow-lg p-8 text-center">
                            <div className="text-6xl mb-4">⚠️</div>
                            <h2 className="text-2xl font-bold text-red-600 mb-4">Cannot Generate Certificate</h2>
                            <p className="text-gray-700 mb-6">{error.error}</p>

                            {error.completed !== undefined && error.total !== undefined && (
                                <div className="mt-4 mb-6">
                                    <p className="text-lg font-semibold text-gray-800">
                                        Progress: {error.completed} / {error.total} modules completed
                                    </p>
                                    <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                                        <div
                                            className="bg-[#665bca] h-3 rounded-full transition-all"
                                            style={{ width: `${(error.completed / error.total) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            <Link
                                href={`/learn/${courseId}`}
                                className="inline-block bg-[#665bca] hover:bg-[#5548b8] text-white px-6 py-3 rounded-lg font-semibold"
                            >
                                Continue Learning
                            </Link>
                        </div>
                    )
                        : certificate && course ? (
                            <div className='space-y-6'>
                                <div
                                    id="certificate"
                                    className="bg-white rounded-lg shadow-2xl p-12 border-8 border-double border-[#665bca] relative overflow-hidden"
                                >

                                    <div className="absolute inset-0 opacity-5">
                                        <div className="absolute top-0 left-0 w-40 h-40 bg-[#665bca] rounded-full -translate-x-20 -translate-y-20"></div>
                                        <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#665bca] rounded-full translate-x-20 translate-y-20"></div>
                                    </div>

                                    <div className="relative z-10 text-center space-y-6">
                                        <div className="space-y-2">
                                            <h1 className="text-5xl font-bold text-[#665bca]">Certificate of Completion</h1>
                                            <div className="mx-auto h-1 w-32 bg-gradient-to-r from-[#665bca] to-purple-600"></div>
                                        </div>

                                        <p className='text-xl text-gray-600'>This is to certify that</p>
                                        <h2 className='text-4xl font-bold text-gray-900 py-4 border-b-2 border-gray-300 inline-block px-12'>
                                            {certificate.userName}
                                        </h2>

                                        <p className='text-xl text-gray-600 pt-4'>
                                            has successfully completed the course
                                        </p>

                                        <h3 className="text-3xl font-bold text-[#665bca] py-2">
                                            {course.title}
                                        </h3>

                                        <div className="flex justify-center gap-8 text-gray-600 pt-4">
                                            <div>
                                                <p className="text-sm">Instructor</p>
                                                <p className="font-semibold">{course.instructor}</p>
                                            </div>
                                            <div className="border-l-2 border-gray-300"></div>
                                            <div>
                                                <p className="text-sm">Completion Date</p>
                                                <p className="font-semibold">
                                                    {new Date(certificate.issued_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div className="border-l-2 border-gray-300"></div>
                                            <div>
                                                <p className="text-sm">Duration</p>
                                                <p className="font-semibold">
                                                    {Math.floor(course.total_duration_seconds / 3600)}hr {Math.floor(course.total_duration_seconds % 3600 / 60)}m
                                                </p>
                                            </div>
                                        </div>

                                        <div className="pt-8">
                                            <p className="text-sm text-gray-500">Certificate Number</p>
                                            <p className="text-lg font-mono font-semibold text-gray-600">{certificate.certificate_number}</p>
                                        </div>

                                        <div className="flex justify-center pt-6">
                                            <div className="size-24 rounded-full bg-gradient-to-br from-[#665bca] to-purple-600 flex items-center justify-center text-white shadow-lg">
                                                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={() => window.print()}
                                        className='bg-[#665bca] hover:bg-[#5548b8] text-white px-8 py-3 rounded-lg font-semi-bold flex items-center gap-2 transition-colors cursor-pointer'
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                        </svg>
                                        Print Certificate
                                    </button>

                                    <Link
                                        href="/courses"
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-semibold transition-colors cursor-pointer"
                                    >
                                        Browse More Courses
                                    </Link>
                                </div>

                            </div>
                        ) : null
                    }
                </div>
            </div>
        </div>
    )
}