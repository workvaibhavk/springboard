"use client"

import { useUser } from "@clerk/nextjs";

const AdditionalInfoPage = () => {

    const { user, isLoaded } = useUser();

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <h2 className="text-lg font-bold mb-4">Additional Information</h2>
            <hr className="border-t border-gray-200 mb-4" />

            <div className="space-y-4">
                <div className="space-y-3">
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-500 mb-1">Phone Number</span>
                        <span className="text-base font-medium pl-1">
                            {(user?.publicMetadata?.phoneNumber as string) || 'Not Provided'}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-500 mb-1">Enrollment Number</span>
                        <span className="text-base font-medium pl-1">
                            {(user?.publicMetadata?.enrNumber as string) || 'Not Provided'}
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdditionalInfoPage