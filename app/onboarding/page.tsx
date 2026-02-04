'use client';

import React from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';
import { updateOnboardingData } from '../action/user';

export default function Page() {

    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = React.useState("");
    const [enrNumber, setEnrNumber] = React.useState("");
    const [loading, setLoading] = React.useState(false);


    useEffect(() => {
        if (isLoaded && user) {
            const phoneNumber = user.publicMetadata.phoneNumber;
            const enrNumber = user.publicMetadata.enrNumber;

            if (phoneNumber && enrNumber) {
                router.push('/dashboard');
            } else {
                router.push('/onboarding');
            }
        }
    }, [isLoaded, user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        try {
            await updateOnboardingData({ phoneNumber, enrNumber });
            await user.reload();
            router.push('/dashboard');
        }

        catch (error) {
            console.error("Error updating user metadata:", error);
        }

        finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="flex flex-col md:flex-row w-full max-w-2xl justify-around py-[50px] px-[25px] bg-white rounded-lg shadow-xl max-h-5xl h-full">


                <div className="w-full md:w-80 mr-0 md:mr-0">
                    <h2 className="text-2xl font-bold mb-2">Complete Your Profile</h2>
                    <p className="text-gray-600 mb-6">Just a few more details to get started</p>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4">
                        <div>
                            <label
                                className="block text-sm font-medium mb-2"
                            >Phone
                                <span className={`text-xs  ${phoneNumber.length === 10 ? 'text-green-500' : 'text-red-500'}`}> {phoneNumber.length}/10 digits  </span>
                            </label>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="87677 85318"
                                // maxLength={10}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#111111]"
                            />
                        </div>

                        <div>
                            <label
                                className="block text-sm font-medium mb-2"
                            >Enrollment Number
                                <span className={`text-xs  ${enrNumber.length === 7 ? 'text-green-500' : 'text-red-500'}`}> {enrNumber.length}/7 digits  </span>
                            </label>
                            <input
                                type="tel"
                                value={enrNumber}
                                onChange={(e) => setEnrNumber(e.target.value)}
                                placeholder="2506084"
                                // maxLength={6}
                                required
                                className="w-full px-4 py-2 mb-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#111111]"
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

                <div className='hidden md:flex items-center justify-center'>
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