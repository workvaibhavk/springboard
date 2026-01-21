export interface Course {
    id: string;
    tags: string;
    level: string;
    title: string;
    category: string;
    created_at: string;
    instructor: string;
    updated_at: string;
    description: string;
    playlist_id: string;
    thumbnail_url: string;
    total_duration_seconds: number;
}

export interface Module {
    id: string;
    course_id: string;
    title: string;
    video_id: string;
    duration_seconds: number;
    order: number;
    created_at: string;
    thumbnail: string;
}

export interface CourseEnrollment {
    id: string;
    user_id: string;
    course_id: string;
    enrolled_at: string;
    completed_at: string | null;
    completed: boolean;
    courses: Course;
}

export interface EnrollmentData {
    userCompletedCourses: CourseEnrollment[];
    userInprogressCourses: CourseEnrollment[];
}

export interface Certificate {
    id: string;
    user_id: string;
    course_id: string;
    certificate_number: string;
    user_name: string;
    issued_at: string;
    userName: string;     // note: appears to be duplicate of user_name
}

export interface CertificateError {
    error: string;
    completed?: number;
    total?: number;
    message?: string;
    code?: string;
}