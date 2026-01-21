// types/learning.ts

export interface Course {
    id: string;
    title: string;
    description: string;
    thumbnailUrl?: string | null;
    level?: 'beginner' | 'intermediate' | 'advanced';
    category?: string;
    tags?: string[];
    created_at?: string;
    updated_at?: string;
    // Add other course properties as needed
}

export interface Module {
    id: string;
    course_id: string;
    title: string;
    videoUrl: string;
    duration?: number | null;
    order?: number;
    description?: string | null;
    created_at?: string;
    updated_at?: string;
    // Add other module properties as needed
}

export interface ProgressData {
    completedModules: string[];
    lastAccessedModule?: string;
    totalWatchTime?: number;
    progress?: number;
    // Add other progress properties as needed
}

export interface VideoPlayerProps {
    currentModule: Module | null;
    onWatchedPercentageChange: (percentage: number) => void;
    onHasWatched90Percent: (hasWatched: boolean) => void;
}

export interface ModuleListProps {
    modules: Module[];
    currentModule: Module | null;
    completedModules: string[];
    onModuleSelect: (module: Module, index: number) => void;
}