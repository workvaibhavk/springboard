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
    length: number;
}
export interface UserDataaaa {
    id: string;
    user_id: string;

    completed_at: string | null;
    courses: Course;
    userDetails: {
        course_id: string;
        enrolled_at: string;
        completed: boolean;

    }
}

export interface UserDataa {
    user_id: string;
    course_id: string;
    enrolled_at: string;
    completed: boolean;
    completed_at: string | null;
    courses: {
        title: string;
    };
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
    userName: string;     
}

export interface CertificateError {
    error: string;
    completed?: number;
    total?: number;
    message?: string;
    code?: string;
}

export interface ModuleCompletion {
    id: string
    module_id: string
    completed: boolean
    completed_at: string | null
    created_at: string
    modules?: {
        id: string
        title: string
        order_index: number
    }
}

export interface ModuleProgress {
    moduleCompletions: ModuleCompletion[]
    totalModules: number
    completedCount: number
}

export interface CourseAnal {
    course_title: string
    course_thumbnail_url: string
    completed_count: number
    ongoing_count: number
    total: number
}

export interface NavLinkProps {
    href: string;
    children: React.ReactNode;
}

export interface MobileNavLinkProps {
    href: string;
    children: React.ReactNode;
    onClick: () => void;
}