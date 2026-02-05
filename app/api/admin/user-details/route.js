import { supabaseAdmin as supabase } from '@/lib/supabase-admin';

export async function POST(request) {
    try {
        const { userId } = await request.json()

        if (!userId || typeof userId !== 'string') {
            return Response.json(
                { error: 'User ID is required' },
                { status: 400 }
            )
        }
        const { data: enrollments, error } = await supabase
            .from('enrollments')
            .select('*, courses(*)')
            .eq('user_id', userId)

        if (error) {
            console.error('Fetch user details error:', error)
            return Response.json(
                { error: 'Failed to fetch user details', details: error.message },
                { status: 500 }
            )
        }
        return Response.json({
            userDetails: enrollments || []
        })
    }

    catch (error) {
        console.error('Unexpected error:', error)
        return Response.json(
            { error: 'An unexpected error occurred', details: error.message },
            { status: 500 }
        )
    }
}