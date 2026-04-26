import { Metadata } from "next";
import { Course, Props } from "@/types";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import CoursePreviewPage from "@/page_components/CoursePage";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { Id } = await params;
  console.log("Generating metadata for course ID:", Id);
  const { data: course, error: courseError } = (await supabase
    .from("courses")
    .select("title, description, thumbnail_url")
    .eq("id", Id)
    .single()) as { data: Course | null; error: Error | null };

  console.log("Course data for metadata:", course);

  if (!course || courseError) {
    console.error("Error fetching course data:", courseError);
    return {
      title: "Course Not Found | vSpringboard",
      robots: { index: false },
    };
  }

  const description =
    course.description || `Learn ${course.title} on vSpringboard...`;
  const image = course.thumbnail_url || "/default-og-image.png";

  return {
    title: `${course.title} | vSpringboard`,
    description: description,
    openGraph: {
      title: course.title,
      description: description,
      images: image,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: course.title,
      description: description,
      images: image,
    },
    alternates: {
      canonical: `https://vspringboard.vercel.app/course/${Id}`,
    },
  };
}

export default function Page() {
  return <CoursePreviewPage />;
}
