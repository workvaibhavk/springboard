import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { auth } from "@clerk/nextjs/server";

export async function GET(request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return Response.json({ isEnrolled: false });
        }

        const { searchParams } = new URL(request.url)
        const courseId = searchParams.get('courseId')

        if (!courseId) {
            return Response.json(
                { error: 'Course ID is required' },
                { status: 400 }
            )
        }

        const { data: enrollmentData, error: enrollmentError } = await supabase
            .from('enrollments')
            .select('*')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .single();

        if (enrollmentError) {
            console.error("User not enrolled:", modulesError);
            return Response.json(
                { error: 'User not enrolled' },
                { status: 404 }
            )
        }

        if (enrollmentData) {
            return Response.json({
                success: true,
                message: 'user is already enrolled successfully!',
                isEnrolled: enrollmentData
            })
        }
        else {
            return Response.json({
                success: false,
                message: 'user is not enrolled!',
                isEnrolled: enrollmentData
            })
        }


    }

    catch (error) {
        console.error('Check enrollment error:', error);
        return Response.json({ isEnrolled: false });
    }

}