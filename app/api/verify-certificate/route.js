import { supabaseAdmin as supabase } from '@/lib/supabase-admin.js'

export async function GET(request) {
    console.log('[GET /api/verify] Request received:', request.url)

    try {
        const { searchParams } = new URL(request.url)
        const certificateId = searchParams.get('certificateId')

        console.log('[GET /api/verify] Extracted certificateId:', certificateId)

        if (!certificateId) {
            console.warn('[GET /api/verify] Missing certificateId parameter')
            return Response.json(
                { error: 'Certificate Not Found' },
                { status: 400 }
            )
        }

        console.log(`[GET /api/verify] Querying certificates table for certificate_number = "${certificateId}"`)

        const { data: certData, error: certErr } = await supabase
            .from('certificates')
            .select('*')
            .eq('certificate_number', certificateId)
            .single()

        console.log('[GET /api/verify] Certificate query result:', { certData: !!certData, certErr })

        if (certErr) {
            console.error('[GET /api/verify] Supabase error fetching certificate:', certErr)
        }

        if (!certData) {
            console.log('[GET /api/verify] No certificate found with certificate_number:', certificateId)
            return Response.json(
                { error: 'Certificate Data Not Available' },
                { status: 404 }
            )
        }

        console.log('[GET /api/verify] Certificate found:', {
            id: certData.id,
            certificate_number: certData.certificate_number,
            course_id: certData.course_id,
            user_name: certData.user_name,
            issued_at: certData.issued_at
        })

        console.log(`[GET /api/verify] Querying courses table for id = ${certData.course_id}`)

        const { data: courseData, error: courseErr } = await supabase
            .from('courses')
            .select('*')
            .eq('id', certData.course_id)
            .single()

        console.log('[GET /api/verify] Course query result:', { courseData: !!courseData, courseErr })

        if (courseErr) {
            console.error('[GET /api/verify] Supabase error fetching course:', courseErr)
        }

        if (!courseData) {
            console.warn('[GET /api/verify] No course found for course_id:', certData.course_id)
            return Response.json(
                { error: 'Course Data Not Available' },
                { status: 404 }
            )
        }

        console.log('[GET /api/verify] Course found:', {
            id: courseData.id,
            title: courseData.title
        })

        const courseId = courseData.id
        const courseName = courseData.title
        const issuedDate = certData.issued_at
        const username = certData.user_name

        console.log('[GET /api/verify] Preparing successful response:', {
            courseId,
            courseName,
            username,
            issuedAt: issuedDate
        })

        return Response.json({
            courseId,
            courseName,
            username,
            issuedAt: issuedDate,
        })

    } catch (error) {
        console.error('[GET /api/verify] Unexpected error in handler:', error)
        console.error('[GET /api/verify] Error stack:', error.stack)

        return Response.json(
            {
                error: 'Something went wrong',
                details: error.message
            },
            { status: 500 }
        )
    }
}