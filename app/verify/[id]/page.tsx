"use client"

import { useUser } from '@clerk/nextjs';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';

export default function Page() {

    const params = useParams();
    const certificateId = params.id
    const { user, isLoaded } = useUser();
    const [courseId, setCourseId] = useState('');
    const [username, setUsername] = useState('');
    const [issuedAt, setIssuedAt] = useState('');
    const [loading, setLoading] = useState(false);
    // const [error, setError] = useState(null);
    const [courseName, setCourseName] = useState('');

    useEffect(() => {
        if (isLoaded && user && certificateId) {
            verifyCertificateOwnership();
            console.log("User is loaded:", user);
            console.log("Certificate ID:", certificateId);
        }
    }, [user, isLoaded, certificateId]);

    const verifyCertificateOwnership = async () => {

        try {
            setLoading(true);
            const response = await fetch(`/api/verify-certificate?certificateId=${certificateId}`);
            const data = await response.json();

            if (!response.ok) {
                console.error("Failed to verify certificate ownership:", data);
                return
            }

            setCourseId(data.courseId);
            setCourseName(data.courseName);
            setUsername(data.username);
            setIssuedAt(data.issuedAt);
            console.log("Verification response:", data);

        }
        catch (error) {
            console.error("Error verifying certificate ownership:", error);
        }
        setLoading(false);
    }
    return (
        <div>
            {loading ? (
                <div>
                    Loading...
                </div>)
                : (
                    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4' >

                        <div className='max-w-4xl mx-auto'>                        <Link
                            href="/"
                            className='inline-flex items-center font-medium mb-4 p-2 hover:bg-gray-100 text-[#665bca] hover:text-[#5548b8]rounded-lg w-fit'>
                            <ChevronLeft />
                            Go Back
                        </Link>

                            <div className='max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8 mt-6'>
                                <h1 className='text-3xl font-bold mb-4 text-center text-gray-800'>Certificate Verification</h1>
                                {courseId ? (
                                    <div className='text-center'>
                                        <p className='text-lg text-gray-700 mb-2'>This certificate is valid and was issued to:</p>
                                        <h2 className='text-2xl font-semibold text-gray-900 mb-4 capitalize '>{username}</h2>
                                        <p className='text-lg text-gray-700'>For successfully completing the course:</p>
                                        <h3 className='text-xl font-medium text-gray-800 mb-4'>{courseName}</h3>
                                        <p className='text-gray-600'>Issued on: {new Date(issuedAt).toLocaleDateString()}</p>
                                    </div>
                                ) : (
                                    <p className='text-red-600 text-center'>Invalid certificate or you do not own this certificate.</p>
                                )}
                            </div>

                        </div>
                    </div>
                )}
        </div>
    )
}