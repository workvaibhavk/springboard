import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin as supabase } from '@/lib/supabase-admin'

export async function GET() {
    const { userId } = await auth()

    if (!userId) {
        return Response.json(
            { error: 'Please sign in' },
            { status: 401 }
        )
    }

    const { data: userCompletedCourses, error: userCompletedCoursesError } = await supabase
        .from('enrollments')
        .select(`*,
            courses (*)
            `)
        .eq('user_id', userId)
        .eq('completed', true)

    if (userCompletedCoursesError) {
        return Response.json(
            { error: 'Error fetching user courses data' },
            { status: 500 }
        )
    }

    const { data: userInprogressCourses, error: userInprogressCoursesError } = await supabase
        .from('enrollments')
        .select(`*,
            courses (*)
            `)
        .eq('user_id', userId)
        .eq('completed', false)

    if (userInprogressCoursesError) {
        return Response.json(
            { error: 'Error fetching user courses data' },
            { status: 500 }
        )
    }

    return Response.json(
        {
            userCompletedCourses: userCompletedCourses || [],  // Ensure array
            userInprogressCourses: userInprogressCourses || []  // Ensure array
        },
        { status: 200 }
    )

}