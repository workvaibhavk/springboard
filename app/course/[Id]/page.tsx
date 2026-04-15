import { Metadata } from "next";
import { Course, Props } from "@/types";
import { supabase } from "@/lib/supabase";
import CoursePreviewPage from "@/page_components/CoursePage";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: course } = (await supabase
    .from("courses")
    .select("title, description, thumbnail_url")
    .eq("id", params.id)
    .single()) as { data: Course | null };

  if (!course) {
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
      canonical: `https://vspringboard.vercel.app/course/${params.id}`,
    },
  };
}

export default function Page() {
  return <CoursePreviewPage />;
}
