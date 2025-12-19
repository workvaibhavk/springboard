import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { auth } from '@clerk/nextjs/server';

export async function POST(request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return Response.json(
                { error: 'Please sign in to enroll' },
                { status: 401 }
            );
        }

        const { courseId } = await request.json();

        if (!courseId) {
            return Response.json(
                { error: 'Course ID is required' },
                { status: 400 }
            )
        }


        const { data: existingEnrollment } = await supabase
            .from('enrollments')
            .select('*')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .single();

        if (existingEnrollment) {
            return Response.json({
                success: true,
                message: 'Already enrolled',
                alreadyEnrolled: true
            });
        }

        const { data, error } = await supabase
            .from('enrollments')
            .insert([
                {
                    user_id: userId,
                    course_id: courseId,
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Enrollment error:', error);
            return Response.json(
                { error: 'Failed to enroll', details: error.message },
                { status: 500 }
            )
        }

        return Response.json({
            success: true,
            message: 'Enrolled successfully!',
            enrollment: data
        })
    }
    catch (error) {
        console.error('API error:', error);
        return Response.json(
            { error: 'Something went wrong', details: error.message },
            { status: 500 }
        );
    }
}