// api/admin/user-module-progress
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

export async function POST(request) {

    try {
        const body = await request.json();
        const { userId, courseId } = body;

        if (!userId || !courseId) {
            return Response.json(
                { error: 'userId and courseId are required' },
                { status: 400 }
            );
        }

        const { data: moduleCompletions, error: completionsError } = await supabase
            .from('user_progress')
            .select(`
                id,
                module_id,
                completed,
                completed_at,
                created_at,
                modules (
                    id,
                    title,
                    order
                )
            `)
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .order('created_at', { ascending: true });

        if (completionsError) {
            return Response.json(
                {
                    error: 'Failed to fetch module completions',
                    details: completionsError.message,
                    hint: completionsError.hint
                },
                { status: 500 }
            );
        }

        const { count: totalModules, error: countError } = await supabase
            .from('modules')
            .select('id', { count: 'exact', head: true })
            .eq('course_id', courseId);

        if (!totalModules || countError) {
            return Response.json(
                {
                    error: 'Cant get totalModules of Course',
                    details: countError.message,
                    hint: countError.hint
                },
                { status: 500 }
            )
        }

        const completedCount = moduleCompletions?.filter(m => m.completed).length ?? 0;

        return Response.json({
            moduleCompletions: moduleCompletions || [],
            totalModules: totalModules || 0,
            completedCount,
        });

    } catch (error) {
        return Response.json(
            { error: 'An unexpected error occurred', details: error.message },
            { status: 500 }
        );
    }
}