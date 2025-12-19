import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

export async function GET(request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return Response.json({ completedModules: [] })
        }


        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get('courseId')


        if (!courseId) {
            return Response.json(
                { error: 'Course ID is required' },
                { status: 400 }
            )
        }

        const { data, error } = await supabase
            .from('user_progress')
            .select('module_id')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .eq('completed', true);

        if (error) throw error;

        const completedModuleIds = data.map(item => item.module_id);

        return Response.json({
            completedModules: completedModuleIds
        })

    }

    catch (error) {
        console.error('Get progress error:', error)
        return Response.json({ completedModules: [] })
    }

}