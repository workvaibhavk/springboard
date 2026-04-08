import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // TODO: Add admin check here based on your admin logic
        // For example: 
        // if (!user.publicMetadata?.isAdmin) { 
        //   return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        // }

        const searchParams = request.nextUrl.searchParams;
        const targetUserId = searchParams.get('userId');
        const courseId = searchParams.get('courseId');

        if (!targetUserId || !courseId) {
            return NextResponse.json(
                { error: 'Missing userId or courseId' },
                { status: 400 }
            );
        }

        const { data: enrollment, error: enrollmentError } = await supabase
            .from('enrollments')
            .select('completed')
            .eq('user_id', targetUserId)
            .eq('course_id', courseId)
            .single();

        if (enrollmentError || !enrollment) {
            return NextResponse.json(
                { error: 'Enrollment not found' },
                { status: 404 }
            );
        }

        if (!enrollment.completed) {
            return NextResponse.json(
                { error: 'Course not completed yet' },
                { status: 400 }
            );
        }

        const certificateResult = await supabase
            .from('certificates')
            .select('*')
            .eq('user_id', targetUserId)
            .eq('course_id', courseId)
            .single();

        let certificate = certificateResult.data;

        if (certificateResult.error || !certificate) {
            const clerkResponse = await fetch(`https://api.clerk.com/v1/users/${targetUserId}`, {
                headers: {
                    Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
                },
            });

            if (!clerkResponse.ok) {
                return NextResponse.json(
                    { error: 'Failed to fetch user details from Clerk' },
                    { status: 500 }
                );
            }

            const userData = await clerkResponse.json();
            const userName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'Student';

            const certificateNumber = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

            const insertResult = await supabase
                .from('certificates')
                .insert({
                    user_id: targetUserId,
                    course_id: courseId,
                    certificate_number: certificateNumber,
                    user_name: userName,
                    issued_at: new Date().toISOString(),
                })
                .select()
                .single();

            if (insertResult.error) {
                console.error('Insert error:', insertResult.error);
                return NextResponse.json(
                    { error: 'Failed to generate certificate', details: insertResult.error.message },
                    { status: 500 }
                );
            }

            certificate = insertResult.data;
        }

        const courseResult = await supabase
            .from('courses')
            .select('*')
            .eq('id', courseId)
            .single();

        if (courseResult.error || !courseResult.data) {
            return NextResponse.json(
                { error: 'Course not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            certificate,
            course: courseResult.data,
        });

    } catch (error) {
        console.error('Error in admin get-user-certificate:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}