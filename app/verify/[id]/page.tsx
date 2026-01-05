"use client"

import { useUser } from '@clerk/nextjs';
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
    const [error, setError] = useState(null);

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
                        {username ? `Certificate owned by ${username} for course ${courseId}` : "Verifying certificate ownership..."}
                        <br />
                        {issuedAt ? `Issued At: ${new Date(issuedAt).toLocaleDateString()}` : ""}
                        <br />                        {certificateId}
                    </div>
                )}
        </div>
    )
}