"use client"

import { UserDataa } from "@/types"
import { UserData } from "@/types/usersdata"
import { useUser } from "@clerk/nextjs"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Certificate, Course } from "@/types"
import CertificateTemplate from "@/page_components/Certificatetemplate"
import { generateCertificatePDF } from "@/lib/Certificatepdfgenerator"

export default function Page() {
    const { isLoaded } = useUser()

    const [users, setUsers] = useState<UserData[]>([])
    const [selectedUser, setSelectedUser] = useState('')
    const [userDetails, setUserDetails] = useState<UserDataa[] | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [certificateData, setCertificateData] = useState<{ certificate: Certificate, course: Course } | null>(null)
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

    useEffect(() => {
        if (isLoaded) {
            getUsersData()
        }
    }, [isLoaded])

    const handleUserClick = async (userId: string) => {
        try {
            setSelectedUser(userId)
            const response = await fetch('/api/admin/user-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            })

            if (!response.ok) {
                throw new Error('Failed to fetch users det');
            }
            const data = await response.json()
            setUserDetails(data.userDetails)
            setShowModal(true)
            console.log('User Details:', data.userDetails)
        }
        catch (error) {
            console.error('Error fetching user details:', error)
        }
    }

    const handleDownloadCertificate = async (userId: string, courseId: string) => {
        try {
            setIsGeneratingPDF(true)

            // Fetch certificate data for the specific user and course
            const response = await fetch(`/api/admin/get-user-certificate?userId=${userId}&courseId=${courseId}`)

            // Check content type before parsing
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Non-JSON response:', text);
                alert('API endpoint error. Check console for details.');
                return;
            }

            const data = await response.json()

            if (!response.ok) {
                alert(data.error || 'Failed to fetch certificate')
                console.error('API Error:', data);
                return
            }

            // Set certificate data to render the hidden component
            setCertificateData({
                certificate: data.certificate,
                course: data.course
            })

            // Wait for the component to render
            await new Promise(resolve => setTimeout(resolve, 100))

            // Generate PDF
            await generateCertificatePDF(data.certificate, data.course, 'admin-certificate')

            // Clear certificate data
            setCertificateData(null)
        } catch (error) {
            console.error('Error downloading certificate:', error)
            alert('Failed to download certificate. Check console for details.')
        } finally {
            setIsGeneratingPDF(false)
        }
    }

    const getUsersData = async () => {
        try {
            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            })
            const data = await response.json()
            console.log(data.users.data)
            setUsers(data.users.data)
        } catch (error) {
            console.error('Error fetching users data:', error)
        }
    }

    return (
        <div className='p-8 rounded-lg shadow-md w-full'>
            <h1 className='text-3xl font-bold'>Admin Users Page</h1>
            <p className='mt-4 text-gray-600'>This is the admin users page. Here you can manage all the users of the platform.</p>

            <div className="mt-6">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead>
                        <tr>
                            <th className="py-3 px-4 bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Sr</th>
                            <th className="py-3 px-4 bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">User id</th>
                            <th className="py-3 px-4 bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Avatar</th>
                            <th className="py-3 px-4 bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                            <th className="py-3 px-4 bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                            <th className="py-3 px-4 bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Enrollment no</th>
                            <th className="py-3 px-4 bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Phone no</th>
                            <th className="py-3 px-4 bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((user, index) => (
                            <tr className="border-t border-gray-200 hover:bg-gray-50" key={user.id}>
                                <td className="py-4 px-4 text-sm text-gray-900">{index + 1}</td>
                                <td className="py-4 px-4 text-sm text-gray-900">{user.id}</td>
                                <td className="py-4 px-4 text-sm text-gray-900">
                                    <Image width={40} height={40} src={user?.imageUrl || '/brand.png'} alt="User Photo" className="w-10 h-10 rounded-full" />
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-900">{user?.firstName || 'No first name'} {user?.lastName || 'No last name'}</td>
                                <td className="py-4 px-4 text-sm text-gray-900">{user?.emailAddresses?.[0]?.emailAddress || 'No email'}</td>
                                <td className="py-4 px-4 text-sm text-gray-900">{user?.publicMetadata.enrNumber || 'No enrollment number'}</td>
                                <td className="py-4 px-4 text-sm text-gray-900">{user?.publicMetadata?.phoneNumber || 'No phone number'}</td>
                                <td className="py-4 px-4 text-sm text-gray-900">
                                    <button
                                        onClick={() => handleUserClick(user.id)}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2">
                                        View
                                    </button>
                                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Hidden certificate renderer */}
            {certificateData && (
                <div style={{ position: 'fixed', left: '-10000px', top: 0 }}>
                    <div id="admin-certificate">
                        <CertificateTemplate
                            certificate={certificateData.certificate}
                            course={certificateData.course}
                        />
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && userDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4">User Details</h2>
                        <table className="w-full">
                            <tbody>
                                <tr className="border-b">
                                    <td className="py-2 font-semibold">User ID:</td>
                                    <td className="py-2">{selectedUser}</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-2 font-semibold">Course Title:</td>
                                    <td className="py-2">{userDetails[0]?.courses?.title || 'No course title'}</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-2 font-semibold">Course ID:</td>
                                    <td className="py-2">{userDetails[0]?.course_id || 'No course ID'}</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-2 font-semibold">Enrollment Date:</td>
                                    <td className="py-2">{userDetails[0]?.enrolled_at || 'No enrollment date'}</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-2 font-semibold">Completion Status:</td>
                                    <td className="py-2">{userDetails[0]?.completed ? 'Completed' : 'In Progress'}</td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Download Certificate Button */}
                        {userDetails[0]?.completed && (
                            <button
                                onClick={() => handleDownloadCertificate(selectedUser, userDetails[0].course_id)}
                                disabled={isGeneratingPDF}
                                className="mt-4 bg-green-500 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded mr-2">
                                {isGeneratingPDF ? 'Generating PDF...' : 'Download Certificate'}
                            </button>
                        )}

                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}