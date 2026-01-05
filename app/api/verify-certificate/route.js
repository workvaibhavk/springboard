import { supabaseAdmin as supabase } from '@/lib/supabase-admin.js'
import { auth, clerkClient } from '@clerk/nextjs/server'

export async function GET(request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return Response.json(
                { error: 'please sign in' },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(request.url)
        const certificateId = searchParams.get('certificateId')

        if (!certificateId) {
            return Response.json(
                { error: 'Certificate Not Found' },
                { status: 400 }
            )
        }

        const { data: certData, error: certErr } = await supabase
            .from('certificates')
            .select('*')
            .eq('user_id', userId)
            .eq('certificate_number', certificateId)
            .single()

        if (!certData || certErr) {
            return Response.json(
                { error: 'Certificate Data Not Available' },
                { status: 404 }
            )
        }

        const { data: courseData, error: courseErr } = await supabase
            .from('courses')
            .select('*')
            .eq('id', certData.course_id)
            .single()

        if (!courseData || courseErr) {
            return Response.json(
                { error: 'Course Data Not Available' },
                { status: 404 }
            )
        }

        const courseId = courseData.id
        const courseName = courseData.title
        const issuedDate = certData.issued_at
        const client = await clerkClient()
        const clerkUser = await client.users.getUser(userId)

        const username = clerkUser.firstName && clerkUser.lastName ? `${clerkUser.firstName} ${clerkUser.lastName}` : clerkUser.emailAddresses[0]?.emailAddress || "Student";

        return Response.json({
            courseId: courseId,
            courseName: courseName,
            username: username,
            issuedAt: issuedDate,
        })

    }
    catch (error) {
        console.error('Something went wrong', error)
        return Response.json(
            { error: 'Something went wrong', details: error.message },
            { status: 500 }
        )
    }
}