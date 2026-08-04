export interface Database {
  public: {
    Tables: {
      payments: {
        Row: {
          id: string;
          clerk_user_id: string | null;
          enrollment_no: string;
          amount: number;
          donation_amount: number | null;
          payment_status: string | null;
          payment_mode: string | null;
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          paid_at: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          clerk_user_id?: string | null;
          enrollment_no: string;
          amount: number;
          donation_amount?: number | null;
          payment_status?: string | null;
          payment_mode?: string | null;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          paid_at?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          clerk_user_id?: string | null;
          enrollment_no?: string;
          amount?: number;
          donation_amount?: number | null;
          payment_status?: string | null;
          payment_mode?: string | null;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          paid_at?: string | null;
          created_at?: string | null;
        };
      };
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