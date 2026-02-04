"use client"

import { Certificate, CertificateError, Course } from '@/types';
import { useUser } from '@clerk/nextjs';
import { BadgeCheck, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code'
import Image from 'next/image';

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

    // ── colour-function regex that html2canvas chokes on ──
    const BAD_COLOR = /\b(lab|oklch|oklab|color)\s*\(/

    /**
     * Rasterise a single <svg> element to a PNG data-URL.
     * We serialise the SVG, draw it on an off-screen <canvas>, and return
     * the PNG string.  This completely removes SVG from the tree so
     * html2canvas never has to parse SVG colour functions.
     */
    const svgToDataUrl = (svg: SVGElement): Promise<string> => {
        return new Promise((resolve, reject) => {
            // Grab the bounding rect from the LIVE svg (clone hasn't been laid out yet)
            // so we fall back to width/height attributes or a default.
            const w = Number(svg.getAttribute('width')) || 140
            const h = Number(svg.getAttribute('height')) || 140

            // Clone the svg so we can tweak it without side effects
            const svgClone = svg.cloneNode(true) as SVGElement
            svgClone.setAttribute('width', String(w))
            svgClone.setAttribute('height', String(h))
            // Ensure it has an xmlns so the blob parses correctly
            svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

            const serialised = new XMLSerializer().serializeToString(svgClone)
            const blob = new Blob([serialised], { type: 'image/svg+xml' })
            const url = URL.createObjectURL(blob)

            const img = document.createElement('img')
            img.onload = () => {
                const canvas = document.createElement('canvas')
                canvas.width = w * 2   // 2× for retina
                canvas.height = h * 2
                const ctx = canvas.getContext('2d')!
                ctx.scale(2, 2)
                ctx.drawImage(img, 0, 0, w, h)
                URL.revokeObjectURL(url)
                resolve(canvas.toDataURL('image/png'))
            }
            img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('SVG rasterise failed')) }
            img.src = url
        })
    }

    const rasteriseSvgs = async (root: HTMLElement) => {
        const svgs = Array.from(root.querySelectorAll<SVGElement>('svg'))
        await Promise.all(svgs.map(async (svg) => {
            try {
                // Use the computed size from the *live* original if possible,
                // otherwise fall back to SVG attributes.
                const rect = svg.getBoundingClientRect()
                const w = rect.width || Number(svg.getAttribute('width')) || 140
                const h = rect.height || Number(svg.getAttribute('height')) || 140

                // Force explicit size on the svg before we serialise it
                svg.setAttribute('width', String(w))
                svg.setAttribute('height', String(h))

                const dataUrl = await svgToDataUrl(svg)

                const img = document.createElement('img')
                img.src = dataUrl
                img.style.width = w + 'px'
                img.style.height = h + 'px'
                img.style.display = 'block'


                svg.parentNode?.replaceChild(img, svg)
            } catch {
                // If one SVG fails to rasterise just leave it; html2canvas
                // will still try (and probably warn) but won't crash the whole flow.
                console.warn('Could not rasterise an SVG, skipping it.')
            }
        }))
    }

    const sanitiseColors = (root: HTMLElement) => {
        const all = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))];
        // This regex catches modern color functions that html2canvas cannot parse
        const BAD_COLOR = /\b(lab|oklch|oklab|color|hwb)\s*\(/;

        all.forEach((el) => {
            const style = window.getComputedStyle(el);

            // 1. Fix Background Gradients (The most common source of 'lab')
            if (BAD_COLOR.test(style.backgroundImage)) {
                el.style.setProperty('background-image', 'linear-gradient(to right, #665bca, #9333ea)', 'important');
            }

            // 2. Fix Solid Colors (Text, Backgrounds, Borders)
            if (BAD_COLOR.test(style.color)) el.style.setProperty('color', '#665bca', 'important');
            if (BAD_COLOR.test(style.backgroundColor)) el.style.setProperty('background-color', '#ffffff', 'important');
            if (BAD_COLOR.test(style.borderColor)) el.style.setProperty('border-color', '#665bca', 'important');

            // 3. Fix SVG properties (Fills and Strokes)
            if (BAD_COLOR.test(style.fill)) el.style.setProperty('fill', '#665bca', 'important');
        });
    };

    const downloadPDF = async () => {
        setDownloading(true);
        try {
            const html2canvas = (await import('html2canvas')).default;
            const { jsPDF } = await import('jspdf');

            const element = document.getElementById('certificate');
            if (!element) return;

            // --- STEP 1: CREATE A HIDDEN DESKTOP CONTAINER ---
            const container = document.createElement('div');
            // We use position: fixed and a massive width to simulate a desktop viewport
            container.style.cssText = `
            position: fixed; 
            top: 0; 
            left: -10000px; 
            width: 1200px; 
            z-index: -9999;
        `;
            document.body.appendChild(container);

            // --- STEP 2: CLONE & FORCE DESKTOP STYLES ---
            const clone = element.cloneNode(true) as HTMLElement;
            // Reset ALL mobile transforms/scaling and force exact PDF dimensions
            clone.style.cssText = `
            width: 900px !important;
            height: 636px !important;
            transform: none !important;
            position: relative !important;
            display: block !important;
            margin: 0 !important;
        `;
            container.appendChild(clone);

            const images = clone.querySelectorAll('img');
            images.forEach(img => {
                img.style.maxWidth = 'none !important';
                img.style.height = 'auto';
                if (img.alt === 'vSpringboard') img.style.width = '105px'; img.style.paddingBottom = '20px';
                if (img.alt === 'Signature') img.style.width = '60px'; img.style.paddingBottom = '20px';
            });

            // --- STEP 4: CLEAN UP COLOR FUNCTIONS ---
            sanitiseColors(clone);

            // Wait a moment for the 'container' layout to settle
            await new Promise(r => setTimeout(r, 500));

            // --- STEP 5: CAPTURE ---
            const canvas = await html2canvas(clone, {
                scale: 3,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                width: 900,
                height: 636,
                // Force the capture window to be large enough for the certificate
                windowWidth: 1000,
                windowHeight: 800
            });

            document.body.removeChild(container);

            // --- STEP 6: GENERATE PDF ---
            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

            // A4 landscape is 297x210mm
            pdf.addImage(imgData, 'PNG', 0, 0, 297, 210, undefined, 'FAST');

            const safeName = certificate?.userName?.replace(/[^a-z0-9]/gi, '_') || 'User';
            pdf.save(`Certificate_${safeName}.pdf`);

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
                                <div
                                    id="certificate"
                                    className="certificate-inner bg-white rounded-lg shadow-2xl border-8 border-double border-[#665bca] relative overflow-hidden"
                                    style={{ minWidth: '900px', minHeight: '636px' }}
                                >
                                    {/* Decorative corner ornaments */}
                                    <div className="absolute inset-0 opacity-5 pointer-events-none">
                                        <div className="absolute top-0 left-0 w-48 h-48 bg-[#665bca] rounded-full -translate-x-24 -translate-y-24"></div>
                                        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600 rounded-full translate-x-24 -translate-y-24"></div>
                                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600 rounded-full -translate-x-24 translate-y-24"></div>
                                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#665bca] rounded-full translate-x-24 translate-y-24"></div>
                                    </div>

                                    {/* Main Content - Centered */}
                                    <div className="relative z-10 flex flex-col items-center justify-center h-full px-16 py-12">

                                        <div className="text-center space-y-4 max-w-3xl">
                                            {/* Header */}
                                            <div className="space-y-3">
                                                <Image
                                                    src="/brand.png"
                                                    alt="vSpringboard"
                                                    width={135}
                                                    height={45}
                                                    className="object-contain mx-auto"
                                                />
                                                <h1 className="text-4xl font-bold text-[#665bca] tracking-wide">
                                                    Certificate of Completion
                                                </h1>
                                                <div className="mx-auto h-1.5 w-24 bg-gradient-to-r from-[#665bca] to-purple-600 rounded-full mt-4"></div>
                                            </div>

                                            {/* Awarded To */}
                                            <div className="space-y-3 py-6">
                                                <p className="text-base text-gray-800 font-semibold">This is to certify that</p>
                                                <h2 className="text-4xl font-bold text-gray-900  border-gray-300 inline-block px-10">
                                                    {certificate.userName}
                                                </h2>
                                                {/* Course Details */}
                                                <div className="space-y-2">
                                                    <p className="text-base text-gray-500 font-medium">
                                                        has successfully completed the course
                                                    </p>
                                                    <h3 className="text-2xl font-bold text-[#665bca] leading-snug px-6">
                                                        {course.title.split(':')[0]?.trim()}
                                                        {course.title.split(':')[1]?.trim() && (
                                                            <span className="block text-base font-semibold opacity-80 mt-1">
                                                                {course.title.split(':')[1]?.trim()}
                                                            </span>
                                                        )}
                                                    </h3>
                                                </div>
                                            </div>



                                            {/* Course Metadata */}
                                            <div className="flex justify-center gap-6 text-gray-600 pt-4 flex-wrap">
                                                <div className="text-center">
                                                    <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Instructor</p>
                                                    <p className="font-semibold text-sm">{course.instructor}</p>
                                                </div>
                                                <div className="w-px bg-gray-300"></div>
                                                <div className="text-center">
                                                    <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Completion Date</p>
                                                    <p className="font-semibold text-sm">
                                                        {new Date(certificate.issued_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                                <div className="w-px bg-gray-300"></div>
                                                <div className="text-center">
                                                    <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Duration</p>
                                                    <p className="font-semibold text-sm">
                                                        {Math.floor(course.total_duration_seconds / 3600)}hr{' '}
                                                        {Math.floor((course.total_duration_seconds % 3600) / 60)}m
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Certificate Number */}
                                            <div className="pt-2">
                                                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Certificate Number</p>
                                                <p className="text-xs font-mono font-semibold text-gray-500">{certificate.certificate_number}</p>
                                            </div>

                                            {/* Signature - Bottom Left */}
                                            <div className="absolute bottom-6 left-6 z-20 bg-white p-2 rounded-lg ">
                                                <div className="pt-6 flex justify-center">
                                                    <div className="text-center">
                                                        <Image
                                                            src="/signature.png"
                                                            alt="Signature"
                                                            width={150}
                                                            height={68}
                                                            className="object-contain mx-auto mb-2"
                                                        />
                                                        <div className="border-t-2 border-gray-400 pt-2 px-6">
                                                            <p className="font-bold text-gray-800 text-sm">Vaibhav Kamble</p>
                                                            <p className="text-xs text-gray-600">vSpringboard Dev</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* QR Code - Bottom Right */}
                                    <div className="absolute bottom-6 right-6 z-20 bg-white p-2 rounded-lg shadow-lg border border-gray-200">
                                        <QRCode
                                            size={120}
                                            value={`https://vspringboard.vercel.app/verify/${certificate.certificate_number}`}
                                            fgColor="#665bca"
                                            level="H"
                                            viewBox="0 0 256 256"
                                        />
                                        <p className="text-[9px] text-center text-gray-500 mt-1">Verify</p>
                                    </div>
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