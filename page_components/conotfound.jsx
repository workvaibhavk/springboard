import Image from "next/image";
import Link from "next/link";

export default function CourseNotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col md:flex-row items-center justify-center gap-10 px-6 py-12 max-w-7xl mx-auto">
      <div className="relative w-full max-w-[320px] md:max-w-[350px] xl:max-w-[350px] aspect-square transition-all duration-300">
        <Image
          src="/nocourse.png"
          alt="No Courses Found"
          width={904}
          height={924}
          priority
        />
      </div>

      <div className="text-center md:text-left max-w-lg">
        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full">
          Empty Result
        </span>

        <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
          Courses Not Found
        </h1>

        <p className="text-gray-500 text-lg xl:text-lg leading-relaxed mb-8">
          Enroll in courses to see them listed here. Explore our course catalog
          to find exciting learning opportunities!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <Link
            href="/courses"
            className="px-8 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition-all shadow-lg hover:shadow-gray-200"
          >
            Browse All Courses
          </Link>
        </div>
      </div>
    </div>
  );
}
