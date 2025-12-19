// app/api/add-course/route.js
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { auth, clerkClient } from '@clerk/nextjs/server';

// Helper function to convert YouTube duration (PT15M33S) to minutes
function parseDuration(duration) {
    if (!duration) return 0;

    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);

    // Convert everything to minutes (round up seconds)
    // return hours * 60 + minutes + Math.ceil(seconds / 60);
    return hours * 3600 + minutes * 60 + seconds;
}

export async function POST(request) {
    try {
        // 1. Check if user is authenticated and is admin
        const { userId } = await auth();

        if (!userId) {
            return Response.json(
                { error: 'Unauthorized. Please sign in.' },
                { status: 401 }
            );
        }

        // 2. Check if user is admin
        const client = await clerkClient();
        const user = await client.users.getUser(userId);

        if (user.publicMetadata?.role !== 'admin') {
            return Response.json(
                { error: 'Admin access required. Contact administrator.' },
                { status: 403 }
            );
        }

        // 1. Get data from the form
        const { playlistId, maxVideos, level, category, tags } = await request.json();

        // 2. Validate playlist ID
        if (!playlistId || !playlistId.startsWith('PL')) {
            return Response.json(
                { error: 'Invalid playlist ID. Must start with PL' },
                { status: 400 }
            );
        }

        const apiKey = process.env.YOUTUBE_API_KEY;

        // 3. Fetch playlist details from YouTube
        const playlistResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${playlistId}&key=${apiKey}`
        );

        const playlistData = await playlistResponse.json();

        // Check if playlist exists
        if (!playlistData.items || playlistData.items.length === 0) {
            return Response.json(
                { error: 'Playlist not found' },
                { status: 404 }
            );
        }

        const playlist = playlistData.items[0];

        // 4. Fetch videos in the playlist
        const videosResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&key=${apiKey}`
        );

        const videosData = await videosResponse.json();


        let videos = [];
        if (videosData.items) {
            videos = videosData.items.filter(video => {
                const title = video.snippet.title;
                const videoId = video.snippet.resourceId?.videoId;

                // Skip if title indicates private/deleted video
                if (!title ||
                    title === 'Private video' ||
                    title === 'Deleted video' ||
                    title.includes('[Private video]') ||
                    title.includes('[Deleted video]')) {
                    return false;
                }

                // Skip if no video ID
                if (!videoId) {
                    return false;
                }

                return true;
            });
        }

        // 7. Limit videos if maxVideos is specified
        if (maxVideos && maxVideos > 0) {
            videos = videos.slice(0, maxVideos);
        }

        // Get video IDs to fetch durations
        const videoIds = videos.map(v => v.snippet.resourceId.videoId).join(',');

        // Fetch video details (includes duration)
        const videoDetailsResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${apiKey}`
        );

        const videoDetailsData = await videoDetailsResponse.json();
        const videoDetails = videoDetailsData.items || [];

        // Create a map of video_id -> duration
        const durationMap = {};
        videoDetails.forEach(video => {
            durationMap[video.id] = video.contentDetails.duration; // e.g., "PT15M33S"
        });

        const courseTags = Array.isArray(tags) && tags.length > 0
            ? tags.slice(0, 3)
            : [];
        // Calculate total duration (sum of all module durations)
        let totalDuration = 0;
        videos.forEach(video => {
            const videoId = video.snippet.resourceId.videoId;
            const duration = parseDuration(durationMap[videoId]);
            totalDuration += duration;
        });
        // 6. Insert course into Supabase
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .insert([
                {
                    title: playlist.snippet.title,
                    description: playlist.snippet.description,
                    thumbnail_url: playlist.snippet.thumbnails.high.url,
                    instructor: playlist.snippet.channelTitle,
                    playlist_id: playlistId,
                    total_duration_seconds: totalDuration,
                    level: level,
                    category: category,
                    tags: courseTags
                }
            ])
            .select()
            .single();

        if (courseError) {
            console.error('Course insert error:', courseError);
            return Response.json(
                { error: 'Failed to create course', details: courseError },
                { status: 500 }
            );
        }

        // 7. Prepare modules data
        const modules = videos.map((video, index) => {
            const videoId = video.snippet.resourceId.videoId;
            const duration = parseDuration(durationMap[videoId]);

            return {
                course_id: course.id,
                title: video.snippet.title,
                video_id: videoId,
                duration_seconds: duration,
                order: index + 1,
                thumbnail: video.snippet.thumbnails.high.url,

            };
        });

        // 8. Insert modules into Supabase
        const { error: modulesError } = await supabase
            .from('modules')
            .insert(modules);

        if (modulesError) {
            console.error('Modules insert error:', modulesError);
            // Delete the course if modules fail
            await supabase.from('courses').delete().eq('id', course.id);
            return Response.json(
                { error: 'Failed to create modules', details: modulesError },
                { status: 500 }
            );
        }

        // 9. Success!
        return Response.json({
            success: true,
            message: `Course created with ${modules.length} modules!`,
            course: {
                id: course.id,
                title: course.title,
                moduleCount: modules.length,
                tags: tags || []
            }
        });

    } catch (error) {
        console.error('Add course error:', error);
        return Response.json(
            { error: 'Something went wrong', details: error.message },
            { status: 500 }
        );
    }
}