// import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
// // import { auth } from "@clerk/nextjs/server";

// export async function GET(request) {
//     try {
//         // const { userId } = await auth();

//         // if (!userId) {
//             // return Response.json({ isEnrolled: false });
//         // }

//         // const { searchParams } = new URL(request.url)
//         // const courseId = searchParams.get('courseId')

//         // if (!courseId) {
//             // return Response.json(
//                 // { error: 'Course ID is required' },
//                 // { status: 400 }
//             // )
//         // }

//         const { completed_data } = await supabase
//             .from('enrollments')
//             .select('*')
//             // .eq('user_id', userId)
//             .eq('completed', TRUE)

//             const { ongoing_data } = await supabase
//             .from('enrollments')
//             .select('*')
//             // .eq('user_id', userId)
//             .eq('completed', FALSE)
//             // .single();

//         return Response.json({
//             success: true,
//             message: 'user is already enrolled successfully!',
//             Analytics: data
//         })
//     }

//     catch (error) {
//         console.error('Check enrollment error:', error);
//         // return Response.json({ isEnrolled: false });
//     }

// }













// import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

// export async function POST() {
//     try {
//         const { data: completed_data, error: completed_error } = await supabase
//             .from('enrollments')
//             .select('*')
//             .eq('completed', true);

//         if (completed_error) throw completed_error;

//         const { data: ongoing_data, error: ongoing_error } = await supabase
//             .from('enrollments')
//             .select('*')
//             .eq('completed', false);

//         if (ongoing_error) throw ongoing_error;

//         return Response.json({
//             success: true,
//             Analytics: {
//                 completed: completed_data,
//                 completed_count: completed_data.length,
//                 ongoing: ongoing_data,
//                 ongoing_count: ongoing_data.length,
//                 total: completed_data.length + ongoing_data.length,
//             }
//         });

//     } catch (error) {
//         console.error('Analytics fetch error:', error);
//         return Response.json(
//             { success: false, error: error.message },
//             { status: 500 }
//         );
//     }
// }

// import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

// export async function POST() {
//     try {
//         const { data, error } = await supabase
//             .from('enrollments')
//             .select('*');

//         if (error) throw error;

//         // Group by course_id
//         const grouped = data.reduce((acc, enrollment) => {
//             const { course_id, completed } = enrollment;

//             if (!acc[course_id]) {
//                 acc[course_id] = {
//                     course_id,
//                     completed: [],
//                     ongoing: [],
//                 };
//             }

//             if (completed) {
//                 acc[course_id].completed.push(enrollment);
//             } else {
//                 acc[course_id].ongoing.push(enrollment);
//             }

//             return acc;
//         }, {});

//         // Convert to array and add counts
//         const Analytics = Object.values(grouped).map(course => ({
//             ...course,
//             completed_count: course.completed.length,
//             ongoing_count: course.ongoing.length,
//             total: course.completed.length + course.ongoing.length,
//         }));

//         return Response.json({
//             success: true,
//             Analytics
//         });

//     } catch (error) {
//         console.error('Analytics fetch error:', error);
//         return Response.json(
//             { success: false, error: error.message },
//             { status: 500 }
//         );
//     }
// // }
// import { clerkClient } from '@clerk/nextjs/server';

// const client = await clerkClient();
// const { data: clerkUsers } = await client.users.getUserList({ limit: 500 });

// const users = clerkUsers.map(user => ({
//     id: user.id,
//     name: user.firstName && user.lastName
//         ? `${user.firstName} ${user.lastName}`
//         : user.emailAddresses[0]?.emailAddress || "Student",
//     enrNumber: user.publicMetadata?.enrNumber ?? null,
// }));







// import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

// export async function POST() {
//     try {
//         // Join enrollments with courses table
//         const { data, error } = await supabase
//             .from('enrollments')
//             .select(`
//                 *,
//                 courses (
//                     id,
//                     title,
//                     thumbnail_url
//                 )
//             `);

//         if (error) throw error;

//         // Group by course_id
//         const grouped = data.reduce((acc, enrollment) => {
//             const { course_id, completed, courses } = enrollment;

//             if (!acc[course_id]) {
//                 acc[course_id] = {
//                     course_id,
//                     course_title: courses?.title,
//                     course_thumbnail_url: courses?.thumbnail_url,
//                     completed: [],
//                     ongoing: [],
//                 };
//             }

//             // Attach user info to each enrollment
//             const enrichedEnrollment = {
//                 ...enrollment,
//                 user: usersMap[enrollment.user_id] || null,
//             };

//             if (completed) {
//                 acc[course_id].completed.push(enrichedEnrollment);
//             } else {
//                 acc[course_id].ongoing.push(enrichedEnrollment);
//             }

//             return acc;
//         }, {});

//         // Convert to array and add counts
//         const Analytics = Object.values(grouped).map(course => ({
//             ...course,
//             completed_count: course.completed.length,
//             ongoing_count: course.ongoing.length,
//             total: course.completed.length + course.ongoing.length,
//         }));

//         return Response.json({
//             success: true,
//             Analytics,
//             users
//         });

//     } catch (error) {
//         console.error('Analytics fetch error:', error);
//         return Response.json(
//             { success: false, error: error.message },
//             { status: 500 }
//         );
//     }
// }


















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