"use client";
import { useUser } from "@clerk/nextjs";
import BackToTopBtn from "@/page_components/backToTopBtn";
import {
  BookOpen,
  ChevronLeft,
  Clock,
  Film,
  MoveRight,
  Play,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Course, Module } from "@/types";
import CAuthenticate from "@/page_components/cauth";
import LoadingComponent from "@/page_components/loady";

function parsePostgresArray(
  pgArray: string | string[] | null | undefined,
): string[] {
  if (!pgArray) return [];
  if (Array.isArray(pgArray)) return pgArray;

  return pgArray
    .replace(/[{}\[\]"\\]/g, "")
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0); // Remove empty strings
}

export default function CoursePreviewPage() {
  const params = useParams();
  const courseId = params.Id ?? "";
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      fetchCourseData();
      checkEnrollmentStatus();
    }
  }, [isLoaded, user]);

  if (!user || !isLoaded) return;

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/get-course-details?courseId=${courseId}`,
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      const data = await response.json();
      setCourse(data.course);
      setModules(data.modules);
      console.log("Course data:", data);
    } catch (error) {
      console.error("Failed fetching course data", error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async () => {
    try {
      setBtnLoading(true);
      const response = await fetch(
        `/api/check-enrollment?courseId=${courseId}`,
      );
      const data = await response.json();
      console.log("hii", data);

      if (data.isEnrolled) {
        console.log("User is enrolled!");
        setIsEnrolled(true);
      } else {
        console.log("User not enrolled");
        setIsEnrolled(false);
      }
    } catch (error) {
      console.error("Error checking enrollment:", error);
      setIsEnrolled(false);
    } finally {
      setBtnLoading(false);
    }
  };
  const handleEnroll = async () => {
    if (isEnrolled) {
      router.push(`/learn/${courseId}`);
      return;
    }

    try {
      setBtnLoading(true);
      const response = await fetch("/api/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: courseId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to enroll");
      }

      console.log("Enrolled successfully!");
      setIsEnrolled(true);
      router.push(`/learn/${courseId}`);
    } catch (error) {
      console.error("Enrollment error:", error);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-0">
      <BackToTopBtn />
      <CAuthenticate />
      <div className="w-11/12 mx-auto">
        {loading ? (
          <LoadingComponent />
        ) : course ? (
          <div>
            {/* <Special /> */}
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="md:w-2/5">
                <div className="aspect-ratio-16-9">
                  <Image
                    src={course.thumbnail_url}
                    alt={course.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="md:w-3/5">
                <p className="text-gray-600 mb-2 font-semibold">
                  by {course.instructor}
                </p>

                <h1 className="text-2xl md:text-5xl font-bold mb-2">
                  {course?.title.split(":")[0]}
                </h1>
                <h2 className="text-xl md:text-2xl font-semibold mb-6">
                  {course?.title.split(":")[1]}
                </h2>

                <div className="flex gap-4 md:gap-6 text-sm mb-4 font-semibold capitalize">
                  <span>
                    <Film className="inline mr-1 size-6 text-[#665bca]" />{" "}
                    {modules.length} Modules
                  </span>
                  <span>
                    <Clock className="inline mr-1 size-6 text-[#665bca]" />{" "}
                    {Math.floor(course.total_duration_seconds / 3600)}hr{" "}
                    {Math.floor((course.total_duration_seconds % 3600) / 60)}min
                  </span>
                  <span>
                    <Zap className="inline mr-1 size-6 text-[#665bca]" />{" "}
                    {course.level}
                  </span>
                </div>

                <div className="mb-3 hidden">
                  <span className="inline-block bg-[#00159d] text-white text-sm font-semibold px-4 py-1 rounded-full">
                    {course.category}
                  </span>
                </div>

                <div className="flex gap-2 mb-2">
                  {parsePostgresArray(course.tags)
                    .slice(0, 3)
                    .map((tag, index) => (
                      <span
                        key={index}
                        className="bg-white py-2 px-4 shadow-md rounded-2xl text-[#000000d4] text-sm font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                </div>

                <div className="my-4">
                  {isEnrolled ? (
                    <Link href={`/learn/${courseId}`}>
                      <button
                        disabled={btnLoading}
                        className="w-full flex items-center justify-center md:w-auto px-8 py-3 bg-[#665bca]  text-white rounded-2xl font-semibold text-lg transition-colors cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {btnLoading && (
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#665bca]"></div>
                        )}
                        Continue Learning <MoveRight className="inline ml-2" />
                      </button>
                    </Link>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={btnLoading}
                      className="w-full flex items-center justify-center md:w-auto px-8 py-3 bg-[#665bca]  text-white rounded-2xl font-semibold text-lg transition-colors cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {btnLoading && (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#665bca]"></div>
                      )}
                      Enroll Now <MoveRight className="inline ml-2" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {course.description && (
              <div className="mb-10 bg-white px-6 md:px-12 py-6 rounded-2xl shadow-md">
                <h2 className="text-3xl font-bold py-2 mb-4">
                  About this course
                </h2>
                <p className="text-lg text-gray-700">
                  {course.description ||
                    "📝 No description provided for this course."}
                </p>
              </div>
            )}
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-8">
                <BookOpen className="inline mr-2 size-8 text-[#665bca]" />{" "}
                Course Content <br /> ({modules.length} modules)
              </h2>

              <div className="space-y-4">
                {modules.map((module: Module) => (
                  <div
                    key={module.id}
                    className="flex flex-col md:flex-row items-center gap-4 p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex-shrink-0">
                      <Image
                        src={module.thumbnail}
                        alt={module.title}
                        width={1280}
                        height={720}
                        className="rounded-xl object-cover md:h-[99px] h-[165px] w-[355px] md:w-[176px]"
                      />
                    </div>

                    <div className="flex-grow">
                      <p className="font-bold text-xl text-[#665bca] mb-1">
                        Lecture {module.order}
                      </p>{" "}
                      <p className="font-semibold text-lg text-gray-900">
                        {module.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <Clock className="inline mr-1 size-4 text-gray-500" />
                        {Math.floor(module.duration_seconds / 60)} min{" "}
                        {Math.floor(module.duration_seconds % 60)} sec
                      </p>
                    </div>

                    <button
                      className="hidden md:flex flex-shrink-0 size-14 text-[#665bca] bg-[#665bca2e]  items-center justify-center rounded-full p-3 hover:bg-[#665bca] hover:text-white cursor-pointer"
                      onClick={() => router.push(`/learn/${courseId}`)}
                    >
                      <Play className="size-4 text-2xl " fill="#665bca" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-600">
              Course Not Found
            </h1>
            <p className="text-gray-600 mt-4">
              This course doesn&apos;t exist.
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center text-[#665bca] hover:text-[#5548b8] mb-6 font-medium"
            >
              <ChevronLeft />
              Back to Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
