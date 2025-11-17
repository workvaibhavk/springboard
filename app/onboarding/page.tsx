'use client';

import React from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';

export default function Page() {

    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = React.useState("");
    const [enrNumber, setEnrNumber] = React.useState("");
    const [loading, setLoading] = React.useState(false);


    useEffect(() => {
        if (isLoaded && user) {
            const phoneNumber = user.unsafeMetadata.phoneNumber;
            const enrNumber = user.unsafeMetadata.enrNumber;

            if (phoneNumber && enrNumber) {
                router.push('/dashboard');
            } else {
                router.push('/onboarding');
            }
        }
    }, [isLoaded, user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);



        try {
            await user.update({
                unsafeMetadata: {
                    phoneNumber: phoneNumber,
                    enrNumber: enrNumber
                }
            });
            router.push('/dashboard');
        }

        catch (error) {
            console.error("Error updating user metadata:", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="flex w-full max-w-2xl justify-around py-[50px] px-[25px] bg-white rounded-lg shadow-xl max-h-5xl h-full">


                <div className="">
                    <h2 className="text-2xl font-bold mb-2">Complete Your Profile</h2>
                    <p className="text-gray-600 mb-6">Just a few more details to get started</p>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Phone Number</label>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="87677 85318"
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#111111]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Enrollment Number</label>
                            <input
                                type="text"
                                value={enrNumber}
                                onChange={(e) => setEnrNumber(e.target.value)}
                                placeholder="2506084"
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#111111]"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#111111] text-white rounded-full px-6 py-3 font-medium hover:bg-[#222222] transition-colors disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Continue to Dashboard"}
                        </button>
                    </form>
                </div>

                <div className='flex items-center justify-center'>
                    <video
                        src="claude_login.mp4"
                        autoPlay
                        loop
                        muted
                        className="w-64 h-86 object-cover rounded-lg"
                    ></video>
                </div>
            </div>
        </div>
    )
}