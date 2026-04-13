import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin as supabase } from '@/lib/supabase-admin'

export async function GET(request) {
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
            { error: "courseId is required" },
            { status: 400 }
        );
    }

    const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

    if (courseError) {
        if (courseError.code === "PGRST116") {
            return Response.json(
                { error: "Course not found" },
                { status: 404 }
            );
        }

        console.error("Error fetching course:", courseError);
        return Response.json(
            { error: "Error fetching course" },
            { status: 500 }
        );
    }

    const { data: modulesData, error: modulesError } = await supabase
        .from("modules")
        .select("*")
        .eq("course_id", courseId)
        .order("order", { ascending: true });

    if (modulesError) {
        console.error("Error fetching modules:", modulesError);
        return Response.json(
            { error: 'Error fetching modules' },
            { status: 500 }
        )
    }

    return Response.json(
        {
            course: courseData,
            modules: modulesData
        },
        { status: 200 }
    )
}
