import { supabase } from "@/lib/supabase";
import { Course } from "@/types";

export default async function sitemap() {
  const baseUrl = "https://vspringboard.vercel.app";

  const { data: courses } = await supabase
    .from("courses")
    .select("id, updated_at");

  const courseEntries = (courses || []).map((course: Course) => ({
    url: `${baseUrl}/course/${course.id}`,
    lastModified: new Date(course.updated_at),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const coursePlayEntries = (courses || []).map((course: Course) => ({
    url: `${baseUrl}/learn/${course.id}`,
    lastModified: new Date(course.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/user`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/credibility`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...courseEntries,
    ...coursePlayEntries,
  ];
}
