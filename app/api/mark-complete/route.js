import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

export async function POST(request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return Response.json(
                { error: 'Please sign in' },
                { status: 401 }
            )
        }

        const { courseId, moduleId } = await request.json()

        if (!courseId || !moduleId) {
            return Response.json(
                { error: 'Course ID and Module ID are required' },
                { status: 400 }

            )
        }

        const { data: existing } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .eq('module_id', moduleId)
            .single()

        if (existing) {
            return Response.json({
                success: true,
                message: 'Already marked as complete',
                alreadyCompleted: true
            })
        }

        const { data, error } = await supabase
            .from('user_progress')
            .insert([{
                user_id: userId,
                course_id: courseId,
                module_id: moduleId,
                completed: true,
                completed_at: new Date().toISOString()
            }])
            .select()
            .single()


        if (error) {
            console.error('Mark complete error:', error)
            return Response.json(
                { error: 'Failed to mark complete', details: error.message },
                { status: 500 }
            )
        }

        return Response.json({
            success: true,
            message: 'Module marked as complete!',
            progress: data
        })

    }

    catch (error) {
        console.error('API error:', error)
        return Response.json(
            { error: 'Something went wrong', details: error.message },
            { status: 500 }
        )
    }
}