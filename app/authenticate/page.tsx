'use client';

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {

    const { user, isLoaded } = useUser();
    const router = useRouter();

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

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#111111] mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
            </div>
        </div>
    )

}