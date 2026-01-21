// lib/courseApi.ts

import { supabase } from '@/lib/supabase';
import type { Course, Module, ProgressData } from '@/types/learning';

interface ApiErrorResponse {
    error?: string;
    message?: string;
}

class CourseApiError extends Error {
    status?: number;

    constructor(message: string, status?: number) {
        super(message);
        this.name = 'CourseApiError';
        this.status = status;
    }
}

/**
 * Fetches course data by ID from Supabase
 */
export async function fetchCourseData(courseId: string): Promise<Course> {
    try {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('id', courseId)
            .single();

        if (error) {
            throw new CourseApiError(error.message);
        }

        if (!data) {
            throw new CourseApiError('Course not found');
        }

        return data as Course;
    } catch (error) {
        if (error instanceof CourseApiError) {
            throw error;
        }
        throw new CourseApiError(
            error instanceof Error ? error.message : 'Failed to fetch course data'
        );
    }
}

/**
 * Fetches modules for a specific course from Supabase
 */
export async function fetchModules(courseId: string): Promise<Module[]> {
    try {
        const { data, error } = await supabase
            .from('modules')
            .select('*')
            .eq('course_id', courseId)
            .order('order', { ascending: true });

        if (error) {
            throw new CourseApiError(error.message);
        }

        return (data || []) as Module[];
    } catch (error) {
        if (error instanceof CourseApiError) {
            throw error;
        }
        throw new CourseApiError(
            error instanceof Error ? error.message : 'Failed to fetch modules'
        );
    }
}

/**
 * Fetches user progress for a specific course
 */
export async function fetchProgress(courseId: string): Promise<ProgressData> {
    try {
        const response = await fetch(`/api/get-progress?courseId=${courseId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new CourseApiError(
                `Failed to fetch progress: ${response.statusText}`,
                response.status
            );
        }

        const data: ProgressData = await response.json();
        return data;
    } catch (error) {
        if (error instanceof CourseApiError) {
            throw error;
        }
        throw new CourseApiError(
            error instanceof Error ? error.message : 'Failed to fetch progress'
        );
    }
}

/**
 * Marks a module as complete for the current user
 */
export async function markModuleComplete(
    courseId: string,
    moduleId: string
): Promise<{ success: boolean; message?: string }> {
    try {
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

        const data: ApiErrorResponse & { success?: boolean } = await response.json();

        if (!response.ok) {
            throw new CourseApiError(
                data.error || data.message || 'Failed to mark complete',
                response.status
            );
        }

        return { success: true, message: data.message };
    } catch (error) {
        if (error instanceof CourseApiError) {
            throw error;
        }
        throw new CourseApiError(
            error instanceof Error ? error.message : 'Failed to mark module as complete'
        );
    }
}

/**
 * Type guard to check if error is CourseApiError
 */
export function isCourseApiError(error: unknown): error is CourseApiError {
    return error instanceof CourseApiError;
}