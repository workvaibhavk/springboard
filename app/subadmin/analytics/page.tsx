"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import Image from "next/image";
import AdminNav from "@/page_components/adminNav"
import { CourseAnal } from "@/types/index"

export default function Page() {

    const { isLoaded } = useUser()
    const [data, setData] = useState<CourseAnal[]>([]);

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
            // console.log(data.users)
            setData(data.Analytics)
        } catch (error) {
            console.error('Error fetching users data:', error)
        }
    }

    return (
        <div className="w-11/12 mx-auto py-4">
            <AdminNav />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 my-10 gap-6">
                {data?.map((course, index) => {
                    return (
                        <div key={index} className="card shadow-md rounded-xl">

                            <div className="aspect-ratio-16-9">
                                <Image
                                    src={course.course_thumbnail_url}
                                    alt={course.course_title}
                                    layout="fill"
                                    objectFit="cover"
                                    className='rounded-t-xl'
                                />
                            </div>

                            <div className="py-4 px-3 rounded-2xl w-full max-w-sm">

                                {/* Title */}
                                <h1 className="text-lg font-bold text-gray-800">
                                    {course.course_title.split(":")[0]}
                                </h1>

                                {/* Subtitle */}
                                <p className="text-sm text-gray-500 mb-4">
                                    {course.course_title.split(":")[1]}
                                </p>

                                {/* Stats */}
                                <div className="flex flex-col gap-2 text-sm text-gray-700">

                                    <div className="flex justify-between">
                                        <span className="font-semibold">Completed</span>
                                        <span className="text-green-600 font-medium">
                                            {course.completed_count}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="font-semibold">Ongoing</span>
                                        <span className="text-yellow-500 font-medium">
                                            {course.ongoing_count}
                                        </span>
                                    </div>

                                    <div className="flex justify-between border-t pt-2 mt-2">
                                        <span className="font-semibold">Total</span>
                                        <span className="text-blue-600 font-semibold">
                                            {course.total}
                                        </span>
                                    </div>

                                </div>
                            </div>

                        </div>
                    )
                })}
            </div>

        </div>
    )
}