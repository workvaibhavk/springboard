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

        const { data } = await supabase
            .from('enrollments')
            .select('*')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .single();

        return Response.json({
            success: true,
            message: 'user is already enrolled successfully!',
            isEnrolled: data
        })
    }

    catch (error) {
        console.error('Check enrollment error:', error);
        return Response.json({ isEnrolled: false });
    }

}