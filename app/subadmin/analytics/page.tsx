"use client"

// import { UserData } from "@/types/usersdata"
import { useUser } from "@clerk/nextjs"
// import Image from "next/image"
import { useEffect, useState } from "react"
// import { Certificate, Course, CourseEnrollment } from "@/types"
// import CertificateTemplate from "@/page_components/Certificatetemplate"
// import { generateCertificatePDF } from "@/lib/Certificatepdfgenerator"
// import { DownloadIcon } from "lucide-react"
// import AdminNav from "@/page_components/adminNav"

export default function Page() {

    const { isLoaded } = useUser()

    // const [users, setUsers] = useState<UserData[]>([])
    // const [selectedUser, setSelectedUser] = useState('')
    const [data, setData] = useState(null);
    // const [showModal, setShowModal] = useState(false)
    // const [certificateData, setCertificateData] = useState<{ certificate: Certificate, course: Course } | null>(null)
    // const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

    useEffect(() => {
        if (isLoaded) {
            getUsersData()
        }
    }, [isLoaded])

    const getUsersData = async () => {
        try {
            const response = await fetch('/api/subadmin-analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data = await response.json()
            console.log(data.Analytics)
            setData(data.Analytics)
        } catch (error) {
            console.error('Error fetching users data:', error)
        }
    }

    return (
        <div>
            {/* <div>{data.Analytics.completed_count}</div> */}
            {/* <div>{data.Analytics.ongoing_count}</div> */}
            {/* <div>{data.Analytics.total}</div> */}

            {data?.map((course) => {
                console.log(course.course_id)
                console.log(course.completed_count)
                console.log(course.ongoing_count)
                console.log("))))))))))))")
            })}
        </div>
    )
}