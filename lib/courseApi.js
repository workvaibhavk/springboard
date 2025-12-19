// lib/courseApi.js
import { supabase } from '@/lib/supabase'

export async function fetchCourseData(courseId) {
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

    if (error) throw error;
    return data;
}

export async function fetchModules(courseId) {
    const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order', { ascending: true });

    if (error) throw error;
    return data;
}

export async function fetchProgress(courseId) {
    const response = await fetch(`/api/get-progress?courseId=${courseId}`);
    const data = await response.json();
    return data;
}

export async function markModuleComplete(courseId, moduleId) {
    const response = await fetch('/api/mark-complete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            courseId,
            moduleId,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to mark complete');
    }

    return data;
}