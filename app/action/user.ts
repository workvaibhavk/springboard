'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'

export async function updateOnboardingData(formData: { phoneNumber: string, enrNumber: string }) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const client = await clerkClient()

    await client.users.updateUserMetadata(userId, {
        publicMetadata: {
            phoneNumber: formData.phoneNumber,
            enrNumber: formData.enrNumber,
        },
    })

    return { success: true }
}