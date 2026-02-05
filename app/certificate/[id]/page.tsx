"use client"

import { Certificate, CertificateError, Course } from '@/types';
import { useUser } from '@clerk/nextjs';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import CertificateTemplate from "@/page_components/Certificatetemplate"
import { generateCertificatePDF } from "@/lib/Certificatepdfgenerator"

export default function Page() {

    const params = useParams();
    const courseId = params.id
    const { user, isLoaded } = useUser();

    const [certificate, setCertificate] = useState<Certificate | null>(null)
    const [course, setCourse] = useState<Course | null>(null)
    const [error, setError] = useState<CertificateError | null>(null)
    const [loading, setLoading] = useState(false)
    const [downloading, setDownloading] = useState(false)

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
                setError(data)
                return;
            }

            setCertificate(data.certificate)
            console.log(data.certificate);
            setCourse(data.course)
        }

        catch (error) {
            console.error('Error fetching certificate:', error)
        }

        finally {
            setLoading(false)
        }
    }

    const downloadPDF = async () => {
        if (!certificate || !course) return;

        setDownloading(true);
        try {
            await generateCertificatePDF(certificate, course, 'certificate');
        } catch (err) {
            console.error('PDF generation failed:', err);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div>
            <style jsx global>{`
                .certificate-wrapper {
                    width: 100%;
                }
                .certificate-inner {
                    min-width: 900px;
                    width: 100%;
                    aspect-ratio: 1.414 / 1;
                }
                @media (max-width: 1024px) {
                    .certificate-wrapper {
                        overflow: hidden;
                        width: 100vw;
                    }
                    .certificate-inner {
                        transform-origin: top left;
                        transform: scale(0.7);
                        min-width: 900px;
                    }
                    .certificate-wrapper {
                        height: 450px;
                    }
                }
                @media (max-width: 768px) {
                    .certificate-inner {
                        transform: scale(0.48);
                        min-width: 900px;
                    }
                    .certificate-wrapper {
                        height: 320px;
                    }
                }
            `}</style>

            <script dangerouslySetInnerHTML={{
                __html: `
                    (function() {
                        function scaleCert() {
                            var wrapper = document.getElementById('cert-wrapper');
                            var inner  = document.getElementById('certificate');
                            if (!wrapper || !inner) return;
                            var vw = window.innerWidth;
                            if (vw < 1024) {
                                var padding = 32;
                                var available = vw - padding * 2;
                                var naturalW = inner.scrollWidth || 900;
                                var scale = available / naturalW;
                                inner.style.transform = 'scale(' + scale + ')';
                                inner.style.transformOrigin = 'top left';
                                wrapper.style.height = (inner.offsetHeight * scale) + 'px';
                                wrapper.style.width = available + 'px';
                                wrapper.style.margin = '0 auto';
                            } else {
                                inner.style.transform = 'none';
                                inner.style.transformOrigin = '';
                                wrapper.style.height = '';
                                wrapper.style.width = '';
                                wrapper.style.margin = '';
                            }
                        }
                        window.addEventListener('load', scaleCert);
                        window.addEventListener('resize', scaleCert);
                    })();
                `
            }} />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
                <div className="max-w-6xl mx-auto">
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
                        <div className="rounded-lg shadow-lg p-8 text-center bg-white">
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
                    ) : certificate && course ? (
                        <div className="space-y-6">

                            <div id="cert-wrapper" className="certificate-wrapper">
                                <div className="certificate-inner">
                                    <CertificateTemplate certificate={certificate} course={course} />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4 justify-center flex-wrap">
                                <button
                                    onClick={downloadPDF}
                                    disabled={downloading}
                                    className="bg-[#665bca] hover:bg-[#5548b8] disabled:opacity-60 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                                >
                                    {downloading ? (
                                        <>
                                            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Download PDF
                                        </>
                                    )}
                                </button>

                                <Link
                                    href="/courses"
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-semibold transition-colors cursor-pointer"
                                >
                                    Browse More Courses
                                </Link>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}