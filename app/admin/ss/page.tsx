"use client"

import { UserData } from "@/types/usersdata"
import { useUser } from "@clerk/nextjs"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Certificate, Course, CourseEnrollment, ModuleProgress } from "@/types"
import CertificateTemplate from "@/page_components/Certificatetemplate"
import { generateCertificatePDF } from "@/lib/Certificatepdfgenerator"
import { DownloadIcon, ChevronDownIcon, ChevronUpIcon, CheckCircle2, Clock } from "lucide-react"

export default function Page() {
    const { isLoaded } = useUser()
    const [users, setUsers] = useState<UserData[]>([])
    const [selectedUser, setSelectedUser] = useState('')
    const [userDetails, setUserDetails] = useState<CourseEnrollment[] | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [certificateData, setCertificateData] = useState<{ certificate: Certificate, course: Course } | null>(null)
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
    const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({})
    const [moduleProgressCache, setModuleProgressCache] = useState<Record<string, ModuleProgress>>({})
    const [loadingModules, setLoadingModules] = useState<Record<string, boolean>>({})

    useEffect(() => {
        if (isLoaded) {
            getUsersData()
        }
    }, [isLoaded])

    const handleUserClick = async (userId: string) => {
        try {
            setSelectedUser(userId)
            setExpandedCourses({})
            setModuleProgressCache({})

            const response = await fetch('/api/admin/user-details', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            })

            if (!response.ok) throw new Error('Failed to fetch user details')

            const data = await response.json()
            setUserDetails(data.userDetails)
            setShowModal(true)
        } catch (error) {
            console.error('Error fetching user details:', error)
        }
    }

    const toggleCourseExpand = async (courseId: string) => {
        const nowExpanded = !expandedCourses[courseId]
        setExpandedCourses(prev => ({ ...prev, [courseId]: nowExpanded }))

        if (nowExpanded && !moduleProgressCache[courseId]) {
            setLoadingModules(prev => ({ ...prev, [courseId]: true }))
            console.log(`[toggleCourseExpand] Fetching module progress — userId=${selectedUser} courseId=${courseId}`)
            try {
                const response = await fetch('/api/admin/user-module-progress', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: selectedUser, courseId }),
                })

                console.log(`[toggleCourseExpand] Response status: ${response.status} ${response.statusText}`)

                const data = await response.json()
                console.log('[toggleCourseExpand] Response JSON:', data)

                if (!response.ok) {
                    console.error('[toggleCourseExpand] ❌ API error:', data.error, '| details:', data.details, '| hint:', data.hint)
                } else {
                    console.log(`[toggleCourseExpand] ✅ Got ${data.moduleCompletions?.length} completions | totalModules=${data.totalModules} | completedCount=${data.completedCount}`)
                    if (data.moduleCompletions?.length === 0) {
                        console.warn('[toggleCourseExpand] ⚠️ Empty array returned — check server terminal for schema probe output')
                    }
                    setModuleProgressCache(prev => ({ ...prev, [courseId]: data }))
                }
            } catch (error) {
                console.error('[toggleCourseExpand] ❌ Fetch threw:', error)
            } finally {
                setLoadingModules(prev => ({ ...prev, [courseId]: false }))
            }
        }
    }

    const handleDownloadCertificate = async (userId: string, courseId: string) => {
        try {
            setIsGeneratingPDF(true)

            const response = await fetch(`/api/admin/get-user-certificate?userId=${userId}&courseId=${courseId}`)

            const contentType = response.headers.get('content-type')
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text()
                console.error('Non-JSON response:', text)
                alert('API endpoint error. Check console for details.')
                return
            }

            const data = await response.json()

            if (!response.ok) {
                alert(data.error || 'Failed to fetch certificate')
                console.error('API Error:', data)
                return
            }

            setCertificateData({ certificate: data.certificate, course: data.course })
            await new Promise(resolve => setTimeout(resolve, 100))
            await generateCertificatePDF(data.certificate, data.course, 'admin-certificate')
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            })
            const data = await response.json()
            setUsers(data.users.data)
        } catch (error) {
            console.error('Error fetching users data:', error)
        }
    }

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

    const formatDateTime = (dateStr: string) =>
        new Date(dateStr).toLocaleString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
        })

    const formatDuration = (seconds: number) =>
        `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`

    return (
        <div className='p-8 rounded-lg shadow-md w-full'>
            <h1 className='text-3xl font-bold'>Admin Users Page</h1>
            <p className='mt-4 text-gray-600'>
                This is the admin users page. Here you can manage all the users of the platform.
            </p>

            <div className="mt-6">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead>
                        <tr>
                            {['Sr', 'User id', 'Avatar', 'Name', 'Email', 'Enrollment no', 'Phone no', 'Actions'].map(h => (
                                <th key={h} className="py-3 px-4 bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                    {h}
                                </th>
                            ))}
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
                                <td className="py-4 px-4 text-sm text-gray-900">
                                    {user?.firstName || 'No first name'} {user?.lastName || 'No last name'}
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-900">
                                    {user?.emailAddresses?.[0]?.emailAddress || 'No email'}
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-900">
                                    {user?.publicMetadata.enrNumber || 'No enrollment number'}
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-900">
                                    {user?.publicMetadata?.phoneNumber || 'No phone number'}
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-900">
                                    <button
                                        onClick={() => handleUserClick(user.id)}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2">
                                        View
                                    </button>
                                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded hidden">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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

            {showModal && userDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-2/3 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4">User Details</h2>

                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold">User ID:</span> {selectedUser}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                <span className="font-semibold">Total Enrollments:</span> {userDetails.length}
                            </p>
                        </div>

                        <h3 className="text-lg font-semibold mb-3">Enrolled Courses</h3>

                        <div className="space-y-4">
                            {userDetails?.map((enrollment: CourseEnrollment) => {
                                const progress = moduleProgressCache[enrollment.course_id]
                                const isExpanded = expandedCourses[enrollment.course_id]
                                const isLoadingMods = loadingModules[enrollment.course_id]

                                return (
                                    <div key={enrollment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">

                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-lg text-gray-800">
                                                    {enrollment.courses?.title || 'No course title'}
                                                </h4>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Instructor: {enrollment.courses?.instructor || 'N/A'}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${enrollment.completed
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {enrollment.completed ? 'Completed' : 'In Progress'}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                                            <div>
                                                <span className="text-gray-500">Course ID:</span>
                                                <p className="font-mono text-xs text-gray-700">{enrollment.course_id}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Enrolled:</span>
                                                <p className="text-gray-700">{formatDate(enrollment.enrolled_at)}</p>
                                            </div>
                                            {enrollment.completed_at && (
                                                <div>
                                                    <span className="text-gray-500">Completed:</span>
                                                    <p className="text-gray-700">{formatDate(enrollment.completed_at)}</p>
                                                </div>
                                            )}
                                            <div>
                                                <span className="text-gray-500">Duration:</span>
                                                <p className="text-gray-700">
                                                    {formatDuration(enrollment.courses?.total_duration_seconds)}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => toggleCourseExpand(enrollment.course_id)}
                                            className="w-full flex items-center justify-between text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-md px-3 py-2 transition-colors mb-3"
                                        >
                                            <span className="flex items-center gap-2">
                                                {isExpanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                                                {isExpanded ? 'Hide' : 'Show'} Module Progress
                                                {progress && (
                                                    <span className="ml-1 text-gray-500 font-normal">
                                                        ({progress.completedCount}/{progress.totalModules} completed)
                                                    </span>
                                                )}
                                            </span>

                                            {progress && (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 bg-gray-200 rounded-full h-1.5">
                                                        <div
                                                            className="bg-blue-500 h-1.5 rounded-full transition-all"
                                                            style={{ width: `${(progress.completedCount / progress.totalModules) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        {progress.totalModules > 0
                                                            ? Math.round((progress.completedCount / progress.totalModules) * 100)
                                                            : 0}%
                                                    </span>
                                                </div>
                                            )}
                                        </button>

                                        {isExpanded && (
                                            <div className="mb-3 border border-gray-100 rounded-lg overflow-hidden">
                                                {isLoadingMods ? (
                                                    <div className="flex items-center justify-center py-6 text-gray-400 text-sm gap-2">
                                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                        </svg>
                                                        Loading modules...
                                                    </div>
                                                ) : progress && progress.moduleCompletions.length > 0 ? (
                                                    <table className="w-full text-sm">
                                                        <thead>
                                                            <tr className="bg-gray-50 border-b border-gray-100">
                                                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">#</th>
                                                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Module</th>
                                                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Completed At</th>
                                                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Started At</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {progress.moduleCompletions
                                                                .sort((a, b) => (a.modules?.order_index ?? 0) - (b.modules?.order_index ?? 0))
                                                                .map((mod, idx) => (
                                                                    <tr key={mod.id} className={`border-b border-gray-50 ${mod.completed ? 'bg-green-50/40' : 'bg-white'}`}>
                                                                        <td className="py-2 px-3 text-gray-400">{idx + 1}</td>
                                                                        <td className="py-2 px-3 font-medium text-gray-800">
                                                                            {mod.modules?.title || mod.module_id}
                                                                        </td>
                                                                        <td className="py-2 px-3">
                                                                            {mod.completed ? (
                                                                                <span className="inline-flex items-center gap-1 text-green-700 font-medium">
                                                                                    <CheckCircle2 className="h-3.5 w-3.5" /> Done
                                                                                </span>
                                                                            ) : (
                                                                                <span className="inline-flex items-center gap-1 text-yellow-600 font-medium">
                                                                                    <Clock className="h-3.5 w-3.5" /> Pending
                                                                                </span>
                                                                            )}
                                                                        </td>
                                                                        <td className="py-2 px-3 text-gray-600 text-xs">
                                                                            {mod.completed_at ? formatDateTime(mod.completed_at) : '—'}
                                                                        </td>
                                                                        <td className="py-2 px-3 text-gray-600 text-xs">
                                                                            {formatDateTime(mod.created_at)}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                        </tbody>
                                                    </table>
                                                ) : (
                                                    <p className="text-center text-sm text-gray-400 py-4">No module data found.</p>
                                                )}
                                            </div>
                                        )}

                                        {enrollment.completed && (
                                            <button
                                                onClick={() => handleDownloadCertificate(selectedUser, enrollment.course_id)}
                                                disabled={isGeneratingPDF}
                                                className="w-full bg-green-500 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded transition-colors flex items-center justify-center gap-2">
                                                {isGeneratingPDF ? (
                                                    <>
                                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                        </svg>
                                                        Generating PDF...
                                                    </>
                                                ) : (
                                                    <>
                                                        <DownloadIcon className="h-4 w-4" />
                                                        Download Certificate
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-6 w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}