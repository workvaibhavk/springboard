import { clerkClient } from '@clerk/nextjs/server';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

export async function POST() {
    try {
        const client = await clerkClient();
        const { data: clerkUsers } = await client.users.getUserList({ limit: 500 });

        const usersMap = Object.fromEntries(
            clerkUsers.map(user => [
                user.id,
                {
                    name: user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.emailAddresses[0]?.emailAddress || "Student",
                    enrNumber: user.publicMetadata?.enrNumber ?? null,
                }
            ])
        );

        const { data, error } = await supabase
            .from('enrollments')
            .select(`
                *,
                courses (
                    id,
                    title,
                    thumbnail_url
                )
            `);

        if (error) throw error;

        const grouped = data.reduce((acc, enrollment) => {
            const { course_id, completed, courses, user_id, enrolled_at, completed_at } = enrollment;

            if (!acc[course_id]) {
                acc[course_id] = {
                    course_id,
                    course_title: courses?.title,
                    course_thumbnail_url: courses?.thumbnail_url,
                    completed: [],
                    ongoing: [],
                };
            }

            if (completed) {
                acc[course_id].completed.push({
                    id: enrollment.id,
                    user_id,
                    enrolled_at,
                    completed_at,
                });
            } else {
                const user = usersMap[user_id];
                acc[course_id].ongoing.push({
                    name: user?.name || "Student",
                    enrNumber: user?.enrNumber || null,
                    enrolled_at,
                });
            }

            return acc;
        }, {});

        const Analytics = Object.values(grouped).map(course => ({
            ...course,
            completed_count: course.completed.length,
            ongoing_count: course.ongoing.length,
            total: course.completed.length + course.ongoing.length,
        }));

        return Response.json({ success: true, Analytics });

    } catch (error) {
        console.error('Analytics fetch error:', error);
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}