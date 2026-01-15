"use client"

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';

export default function Page() {

    const params = useParams();
    const certificateId = params.id
    // const { user, isLoaded } = useUser();
    const [courseId, setCourseId] = useState('');
    const [username, setUsername] = useState('');
    const [issuedAt, setIssuedAt] = useState('');
    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    const [courseName, setCourseName] = useState('');

    useEffect(() => {
        console.log("useEffect triggered");
        console.log("Current certificateId:", certificateId);

        if (certificateId) {
            console.log("Certificate ID is present. Calling verifyCertificateOwnership...");
            verifyCertificateOwnership();
            console.log("Certificate ID (logged inside effect):", certificateId);
        } else {
            console.log("No certificateId provided. Skipping verification.");
        }
    }, [certificateId]);

    const verifyCertificateOwnership = async () => {
        console.log("verifyCertificateOwnership started");
        console.log("Verifying ownership for certificateId:", certificateId);

        try {
            console.log("Setting loading state to true");
            setLoading(true);

            console.log("Making API request to /api/verify-certificate...");
            const response = await fetch(`/api/verify-certificate?certificateId=${certificateId}`);

            console.log("API response received:", response);
            console.log("Response status:", response.status);
            console.log("Response ok:", response.ok);

            // Check if response is JSON before parsing
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                console.error("Response is not JSON. Content-Type:", contentType);
                const text = await response.text();
                console.error("Response body:", text);
                return;
            }

            const data = await response.json();
            console.log("Parsed response data:", data);

            if (!response.ok) {
                console.error("Failed to verify certificate ownership. HTTP status:", response.status);
                console.error("Error response body:", data);
                return;
            }

            console.log("Certificate ownership verified successfully!");
            console.log("Setting courseId:", data.courseId);
            console.log("Setting courseName:", data.courseName);
            console.log("Setting username:", data.username);
            console.log("Setting issuedAt:", data.issuedAt);

            setCourseId(data.courseId);
            setCourseName(data.courseName);
            setUsername(data.username);
            setIssuedAt(data.issuedAt);

            console.log("Verification response processed successfully:", data);
        } catch (error) {
            console.error("Exception occurred while verifying certificate ownership:", error);
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
        } finally {
            console.log("Setting loading state to false");
            setLoading(false);
            console.log("verifyCertificateOwnership completed");
        }
    };
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