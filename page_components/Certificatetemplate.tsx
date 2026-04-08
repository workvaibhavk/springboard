import Image from 'next/image';
import QRCode from 'react-qr-code';
import { Certificate, Course } from '@/types';

interface CertificateTemplateProps {
    certificate: Certificate;
    course: Course;
}

export default function CertificateTemplate({ certificate, course }: CertificateTemplateProps) {
    return (
        <div
            id="certificate"
            className="bg-white rounded-lg shadow-2xl border-8 border-double border-[#665bca] relative overflow-hidden"
            style={{ width: '900px', height: '636px' }}
        >
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-0 left-0 w-48 h-48 bg-[#665bca] rounded-full -translate-x-24 -translate-y-24"></div>
                <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600 rounded-full translate-x-24 -translate-y-24"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600 rounded-full -translate-x-24 translate-y-24"></div>
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#665bca] rounded-full translate-x-24 translate-y-24"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center h-full px-16 py-12">
                <div className="text-center space-y-4 max-w-3xl">
                    <div className="space-y-3">
                        <Image
                            src="/brand.png"
                            alt="vSpringboard"
                            width={135}
                            height={45}
                            className="object-contain mx-auto"
                        />
                        <h1 style={{ paddingBottom: '10px' }} className="text-4xl my-4 font-bold text-[#665bca] tracking-wide">
                            Certificate of Completion
                        </h1>
                        <div className="mx-auto h-1.5 w-24 bg-gradient-to-r from-[#665bca] to-purple-600 rounded-full mt-4"></div>
                    </div>

                    <div className="space-y-3 py-6">
                        <p style={{ color: '#424242' }} className="text-base text-gray-800 font-semibold"> This is to certify that</p>
                        <h2 style={{ color: '#000000' }} className="text-5xl font-bold text-gray-900 border-gray-300 inline-block pt-2 pb-6 mb-6">
                            {certificate.user_name}
                        </h2>
                        <div className="space-y-2">
                            <p style={{ color: '#757575' }} className="text-base text-gray-500 font-medium">
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
                    <div style={{ color: '#757575' }} className="flex justify-center gap-6 text-gray-600 pt-4 flex-wrap">
                        <div className="text-center">
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Instructor</p>
                            <p style={{ color: '#616161' }} className="font-semibold text-sm">{course.instructor}</p>
                        </div>
                        <div className="w-px bg-gray-300"></div>
                        <div className="text-center">
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Completion Date</p>
                            <p style={{ color: '#616161' }} className="font-semibold text-sm">
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
                            <p style={{ color: '#616161' }} className="font-semibold text-sm ">
                                {Math.floor(course.total_duration_seconds / 3600)}hr{' '}
                                {Math.floor((course.total_duration_seconds % 3600) / 60)}m
                            </p>
                        </div>
                    </div>

                    <div style={{ color: '#757575' }} className="pt-2">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Certificate Number</p>
                        <p style={{ color: '#616161' }} className="text-xs font-mono font-semibold text-gray-500">{certificate.certificate_number}</p>
                    </div>

                    <div className="absolute bottom-6 left-6 z-20 bg-white p-2 rounded-lg">
                        <div className="pt-6 flex justify-center">
                            <div className="text-center">
                                <Image
                                    src="/signature.png"
                                    alt="Signature"
                                    width={150}
                                    height={68}
                                    className="object-contain mx-auto mb-2"
                                />
                                <div className="border-t-2 border-gray-400 pt-2 px-4">
                                    <p style={{ color: '#000000' }} className="font-bold text-gray-800 text-sm">Vaibhav Kamble</p>
                                    <p style={{ color: '#424242' }} className="text-xs text-gray-600">vSpringboard Dev</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-6 right-6 z-20 bg-white p-2 rounded-lg shadow-lg border border-gray-200">
                <QRCode
                    size={120}
                    value={`https://vspringboard.vercel.app/verify/${certificate.certificate_number}`}
                    fgColor="#665bca"
                    level="H"
                    viewBox="0 0 256 256"
                />
                <p style={{ color: '#000000' }} className="font-bold text-gray-800 mb-2 text-center text-sm">Verify</p>
            </div>
        </div>
    );
}