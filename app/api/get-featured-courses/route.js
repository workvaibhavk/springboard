import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin as supabase } from '@/lib/supabase-admin'


export async function POST(request) {
    const { userId } = await auth()

    if (!userId) {
        return Response.json(
            { error: 'Please sign in' },
            { status: 401 }
        )
    }

    const body = await request.json();
    const featuredCourseIds = body.featuredCourseIds;

    const { data: featuredCourses, error: featuredCoursesError } = await supabase
        .from('courses')
        .select('*')
        .in('id', featuredCourseIds)

    if (featuredCoursesError) {
        return Response.json(
            { error: 'Error fetching featured courses data' },
            { status: 500 }
        )
    }
    return Response.json(
        { featuredCourses: featuredCourses || [] },
        { status: 200 }
    )
}