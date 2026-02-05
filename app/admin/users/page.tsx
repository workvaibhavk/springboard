"use client"

import { UserData } from "@/types/usersdata"
import { useUser } from "@clerk/nextjs"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function Page() {
    const { isLoaded } = useUser()

    const [users, setUsers] = useState<UserData[]>([])
    useEffect(() => {
        if (isLoaded) {
            getUsersData()
        }
    }, [isLoaded])


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
                        {/* Example user row */}
                        {/* Replace with dynamic data from your database */}
                        {users?.map((user, index) => (
                            <tr className="border-t border-gray-200" key={user.id}>

                                <td className="py-4 px-4 text-sm text-gray-900">{index + 1}</td>
                                <td className="py-4 px-4 text-sm text-gray-900">{user.id}</td>
                                <td className="py-4 px-4 text-sm text-gray-900"><Image width={40} height={40} src={user?.imageUrl || '/brand.png'} alt="User Photo" className="w-10 h-10 rounded-full" /></td>
                                <td className="py-4 px-4 text-sm text-gray-900">{user?.firstName || 'No first name'} {user?.lastName || 'No last name'}</td>
                                <td className="py-4 px-4 text-sm text-gray-900">{user?.emailAddresses?.[0]?.emailAddress || 'No email'}</td>
                                <td className="py-4 px-4 text-sm text-gray-900">{user?.publicMetadata.enrNumber || 'No enrollment number'}</td>
                                <td className="py-4 px-4 text-sm text-gray-900">{user?.publicMetadata?.phoneNumber || 'No phone number'}</td>

                                <td className="py-4 px-4 text-sm text-gray-900">
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2">Edit</button>
                                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {/* Add more user rows as needed */}
                    </tbody>
                </table>


            </div>
        </div>
    )
}