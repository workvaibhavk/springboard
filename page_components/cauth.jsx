'use client';

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CAuthenticate() {

    const { user, isLoaded } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isLoaded) return;

        else if (isLoaded && !user) {
            router.push('/');
        }

        if (isLoaded && user) {
            const phoneNumber = user.publicMetadata.phoneNumber;
            const enrNumber = user.publicMetadata.enrNumber;

            if (!phoneNumber || !enrNumber) {
                router.push('/onboarding');
            } else {

            }
        }
    }, [isLoaded, user, router]);

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#111111] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div>
        </div>
    )

}