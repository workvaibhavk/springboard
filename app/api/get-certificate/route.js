import { supabaseAdmin as supabase } from '@/lib/supabase-admin.js'
import { auth, clerkClient } from '@clerk/nextjs/server'
// import { error } from 'console'

export async function GET(request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return Response.json(
                { error: 'Please sign in' },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(request.url)
        const courseId = searchParams.get('courseId')

        if (!courseId) {
            return Response.json(
                { error: 'Course id is required' },
                { status: 400 }
            )
        }

        const { data: course, error: courseError } = await supabase
            .from('courses')
            .select('*')
            .eq('id', courseId)
            .single()

        if (courseError || !course) {
            return Response.json(
                { error: 'Course not found' },
                { status: 404 }
            )
        }

        const { data: modules } = await supabase
            .from('modules')
            .select('id')
            .eq('course_id', courseId)

        const { data: completedModules } = await supabase
            .from('user_progress')
            .select('module_id')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .eq('completed', true)

        const totalModules = modules?.length || 0;
        const completedCount = completedModules?.length || 0;

        if (completedCount < totalModules || totalModules === 0) {
            return Response.json(
                {
                    error: 'Course not completed yet',
                    completed: completedCount,
                    total: totalModules
                },
                { status: 403 }
            )
        }

        let { data: certificate } = await supabase
            .from('certificates')
            .select('*')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .single()

        if (!certificate) {

            const year = new Date().getFullYear()

            const courseCode = course.title
                .split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
                .slice(0, 3)

            const { count } = await supabase
                .from('certificates')
                .select('*', { count: 'exact', head: true })

            const sequentialNumber = String(count + 1).padStart(6, '0')

            const certificateNumber = `${year}-${courseCode}-${sequentialNumber}`

            const { data: newCert, error: certError } = await supabase
                .from('certificates')
                .insert([{
                    user_id: userId,
                    course_id: courseId,
                    certificate_number: certificateNumber,
                }])
                .select()
                .single()

            if (certError) {
                console.error('Certificate creation error', certError)
                return Response.json(
                    { error: 'Failed to generate certificate' },
                    { status: 500 }
                )
            }

            const { data: issuing, error: issuingErr } = await supabase
                .from('enrollments')
                .update({
                    completed_at: new Date().toISOString()
                })
                .eq('course_id', courseId)
                .eq('user_id', userId)
                .select()
                .single()

            if (!issuing) {
                console.error('error saving completed_at', issuingErr)
            }
            certificate = newCert
        }




        // const clerkUser = await clerkClient.users.getUser(userId)
        const client = await clerkClient()
        const clerkUser = await client.users.getUser(userId)

        const userName = clerkUser.firstName && clerkUser.lastName
            ? `${clerkUser.firstName} ${clerkUser.lastName}`
            : clerkUser.emailAddresses[0]?.emailAddress || "Student";

        return Response.json({
            certificate: {
                ...certificate,
                userName: userName
            },
            course: course
        })

    }

    catch (error) {
        console.error('Got certificate error', error)
        return Response.json(
            { error: 'Something went wrong', details: error.message },
            { status: 500 }
        )
    }
}