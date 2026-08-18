"use client";

import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import CNotFound from "@/page_components/conotfound";
import LoadingComponent from "@/page_components/loady";
import DNavbar from "@/page_components/DNavbar";
import BackToTopBtn from "@/page_components/backToTopBtn";
// import Special from '@/page_components/Special'
import Footer from "@/page_components/Footer";
import {
  CircleDollarSign,
  CodeXml,
  Fingerprint,
  Sparkles,
  SplinePointer,
} from "lucide-react";
import { Course, CourseEnrollment, EnrollmentData, Card } from "@/types";
import Link from "next/link";
import ResAuthenticate from "@/page_components/resauth";
type PaymentStatus = "success" | "pending" | "failed" | "";

function parsePostgresArray(
  pgArray: string | string[] | null | undefined,
): string[] {
  if (!pgArray) return [];
  if (Array.isArray(pgArray)) return pgArray;

  return pgArray
    .replace(/[{}\[\]"\\]/g, "")
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

const Featured = [
  // "5fd8166e-6daf-48a7-8d2b-208df0c94953",
  // "9bda6221-0975-419c-b78e-727083b48382",
  // "26e07fe1-d15d-4eee-a954-69f4c549cb52",
  // "5b1bfba6-107e-44f3-ba84-48b21c5f8531",

  "7ade97f6-745c-4fd0-ae12-82962e801c74",
  "c853bd90-1154-4978-9225-e24aa96435a4",
  "bda2772e-f70d-4efa-8924-b488943bcaea",
  "6cc3471d-a7eb-4502-932c-3facc0127d0a",
  "36556fc4-3047-498a-992e-640ca55ccce0"
];

export default function Page() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
   const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("");
  const [enrolledCourses, setEnrolledCourses] = useState<CourseEnrollment[]>(
    [],
  );
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/get-user-courses-data");
      if (!response.ok) {
        console.warn(`Server responded with ${response.status}`);
        setEnrolledCourses([]);
        return;
      }
      const data: EnrollmentData = await response.json();
      console.clear();
      console.log("Enrolled Courses:", data);
      setEnrolledCourses(data.userInprogressCourses || []);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/get-featured-courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ featuredCourseIds: Featured }),
      });
      if (!response.ok) {
        console.warn(`Server responded with ${response.status}`);
        setFeaturedCourses([]);
        return;
      }
      const data = await response.json();
      console.log("Featured Courses:", data);
      setFeaturedCourses(data.featuredCourses);
    } catch (error) {
      console.error("Error fetching featured courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=> {
if(!isLoaded || !user) return;

    if (isLoaded && user){
      const paymentStat = user.publicMetadata?.payment as PaymentStatus;
    setPaymentStatus(paymentStat);
    }
  },[isLoaded, user]);

  useEffect(() => {
    fetchEnrolledCourses();
    fetchFeaturedCourses();
  }, [user, isLoaded]);

  const categories = [
    { name: "Design", icon: SplinePointer },
    { name: "Cyber Security", icon: Fingerprint },
    { name: "Business", icon: CircleDollarSign },
    { name: "Artificial Intelligence", icon: Sparkles },
    { name: "Programming", icon: CodeXml },
  ];

  return (
    <>
      <DNavbar />
      <ResAuthenticate />
      {!isLoaded || !user || loading ? (
        <LoadingComponent />
      ) : (
        <div>
          <BackToTopBtn />
          {/* <Special /> */}
          <main>
            <div className="h-[40vh] justify-center items-center flex flex-col gap-6 text-center w-11/12 md:w-10/12 mx-auto mt-32 mb-16">
              <h1 className=" text-4xl md:text-5xl capitalize font-semibold pt-0">
                Which Skill To Conquer Today,{" "}
                <span className="text-[#665bca]"> {user?.firstName} </span>
              </h1>

              <p className="w-10/12 md:w-6/12 text-gray-600">
                Join a global community of learners and experts. From
                foundational concepts to advanced mastery, discover tailored
                learning paths that empower you to grow at your own pace
              </p>

              <div className="flex md:flex-row flex-col bg-black justify-around items-center py-6 px-4 rounded-2xl">
  <div className="flex justify-around items-center py-6 px-4 rounded-2xl">
  <Image src="/cpay.jpeg" width={200} height={200} alt="CPay" className="max-w-24"/>
  
  <div className=""></div>
  
  <div className="text-[#fff] font-bold text-sm md:text-xl flex justify-center flex-col text-center">
    <p className="opacity-50">Computer Networks</p>
    <p className="opacity-50">RJ45 Payment</p>
    <p className="text-green-600">5.68 Rs</p>
  </div>
    </div>

  
  <div className="">
    <Link 
      href="https://rzp.io/rzp/BOmZyI0"
      className="relative inline-block overflow-hidden bg-[#4e4e4e] font-semibold border-2 border-black text-white rounded-full px-6 py-3 transition-all duration-300 cursor-pointer text-[20px] font-medium group"
    >
      <span className="relative z-10">Pay Online</span>
      
      {/* Fixed Overlay */}
      <span className="absolute inset-0 w-full h-full -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>
    </Link>
  </div>

 <div className="mt-4">
  {paymentStatus === "success" ? (
    <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-green-700 font-semibold border border-green-300">
      <span>✅</span>
      <span>Payment Successful</span>
    </div>
  ) : paymentStatus === "pending" ? (
    <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-yellow-700 font-semibold border border-yellow-300">
      <span>⏳</span>
      <span>Payment Pending</span>
    </div>
  ) : paymentStatus === "failed" ? (
    <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-red-700 font-semibold border border-red-300">
      <span>❌</span>
      <span>Payment Failed</span>
    </div>
  ) : (
    <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-gray-700 font-semibold border border-gray-300">
      <span>💳</span>
      <span>Payment Due</span>
    </div>
  )}
</div>
  
</div>
            </div>

            <section className="w-11/12 md:w-11/12 m-auto">
              <h2 className="text-4xl border-l-4 border-[#665bca] pl-4 font-bold mt-20 mb-8 ">
                Featured Courses
              </h2>

              {featuredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {featuredCourses.map((course) => {
                    return (
                      <div
                        key={course.id}
                        className="course-card w-full border border-gray-200 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                      >
                        <div className="aspect-ratio-16-9">
                          <Image
                            src={course.thumbnail_url}
                            alt={course.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            objectFit="cover"
                            className="rounded-t-xl"
                          />
                        </div>

                        <div className="content flex flex-col justify-between p-4 space-y-3 min-h-[220px]">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium text-indigo-700">
                              {course.category}
                            </p>
                            <p className="font-bold text-xl line-clamp-2 text-gray-800">
                              {course.title}
                            </p>
                            <p className="text-gray-500 text-sm">
                              {course.instructor}
                            </p>
                          </div>

                          <div className="flex gap-2 text-xs font-medium flex-wrap mt-2">
                            {parsePostgresArray(course.tags)
                              .slice(0, 3)
                              .map((tag, index) => (
                                <span
                                  key={index}
                                  className="bg-gray-100 py-1 px-3 rounded-full text-gray-600 whitespace-nowrap"
                                >
                                  {tag}
                                </span>
                              ))}
                          </div>

                          <div className="font-semibold text-sm text-gray-700 flex items-center pt-2 border-t border-gray-100">
                            <svg
                              className="w-4 h-4 mr-1 text-gray-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              ></path>
                            </svg>
                            <span>
                              {Math.floor(course.total_duration_seconds / 3600)}
                              hr{" "}
                              {Math.floor(
                                (course.total_duration_seconds % 3600) / 60,
                              )}
                              min
                            </span>
                            <span className="mx-2 text-gray-400">|</span>
                            <span className="capitalize">{course.level}</span>
                          </div>

                          <Link
                            className="w-full mt-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-colors duration-150 cursor-pointer text-center"
                            href={`/course/${course.id}`}
                          >
                            Enroll Now
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <CNotFound />
              )}

              <h2 className="text-4xl border-l-4 border-[#665bca] pl-4 font-bold mt-20 mb-8">
                Enrolled Courses
              </h2>

              {enrolledCourses.length <= 0 ? (
                <CNotFound />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {enrolledCourses &&
                    enrolledCourses.map((enrollment) => {
                      const course: Course = enrollment.courses;
                      return (
                        <div
                          key={enrollment.id}
                          className="course-card w-full border border-gray-200 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                        >
                          <div className="aspect-ratio-16-9">
                            <Image
                              src={course.thumbnail_url}
                              alt={course.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              objectFit="cover"
                              className="rounded-t-xl"
                            />
                          </div>

                          <div className="content flex flex-col justify-between p-4 space-y-3 min-h-[220px]">
                            <div className="flex flex-col space-y-1">
                              <p className="text-sm font-medium text-indigo-700">
                                {course.category}
                              </p>
                              <p className="font-bold text-xl line-clamp-2 text-gray-800">
                                {course.title}
                              </p>
                              <p className="text-gray-500 text-sm">
                                {course.instructor}
                              </p>
                            </div>

                            <div className="flex gap-2 text-xs font-medium flex-wrap mt-2">
                              {parsePostgresArray(course.tags)
                                .slice(0, 3)
                                .map((tag, index) => (
                                  <span
                                    key={index}
                                    className="bg-gray-100 py-1 px-3 rounded-full text-gray-600 whitespace-nowrap"
                                  >
                                    {tag}
                                  </span>
                                ))}
                            </div>

                            <div className="font-semibold text-sm text-gray-700 flex items-center pt-2 border-t border-gray-100">
                              <svg
                                className="w-4 h-4 mr-1 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                              </svg>
                              <span>
                                {Math.floor(
                                  course.total_duration_seconds / 3600,
                                )}
                                hr{" "}
                                {Math.floor(
                                  (course.total_duration_seconds % 3600) / 60,
                                )}
                                min
                              </span>
                              <span className="mx-2 text-gray-400">|</span>
                              <span className="capitalize">{course.level}</span>
                            </div>

                            <Link
                              href={`/learn/${course.id}`}
                              className="w-full mt-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-colors duration-150 cursor-pointer text-center"
                            >
                              Continue
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}

              <h2 className="text-3xl md:text-4xl border-l-4 border-[#665bca] pl-4 font-bold mt-14 ">
                Newly Added Courses
              </h2>
              <CNotFound />
            </section>
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}
