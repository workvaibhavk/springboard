export interface Database {
    public: {
        Tables: {
            courses: {
                Row: {
                    id: string;
                    title: string;
                    description: string;
                    thumbnailUrl: string | null;
                    level: 'beginner' | 'intermediate' | 'advanced';
                    category: string;
                    tags: string[];
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['courses']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['courses']['Insert']>;
            };
            modules: {
                Row: {
                    id: string;
                    course_id: string;
                    title: string;
                    videoUrl: string;
                    duration: number | null;
                    order: number;
                    description: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['modules']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['modules']['Insert']>;
            };
        };
    };
}