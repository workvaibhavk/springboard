"use client";

import { UserData } from "@/types/usersdata";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Certificate, Course, CourseEnrollment } from "@/types";
import CertificateTemplate from "@/page_components/Certificatetemplate";
import { generateCertificatePDF } from "@/lib/Certificatepdfgenerator";
import { DownloadIcon } from "lucide-react";
import BackToTopBtn from "@/page_components/backToTopBtn";

export default function Page() {
  const { isLoaded } = useUser();

  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [userDetails, setUserDetails] = useState<CourseEnrollment[] | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);
  const [certificateData, setCertificateData] = useState<{
    certificate: Certificate;
    course: Course;
  } | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      getUsersData();
    }
  }, [isLoaded]);

  const handleUserClick = async (userId: string) => {
    try {
      setSelectedUser(userId);
      const response = await fetch("/api/admin/user-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users det");
      }
      const data = await response.json();
      setUserDetails(data.userDetails);
      setShowModal(true);
      console.log("User Details:", data.userDetails);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleDownloadCertificate = async (
    userId: string,
    courseId: string,
  ) => {
    try {
      setIsGeneratingPDF(true);

      const response = await fetch(
        `/api/admin/get-user-certificate?userId=${userId}&courseId=${courseId}`,
      );

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        alert("API endpoint error. Check console for details.");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to fetch certificate");
        console.error("API Error:", data);
        return;
      }

      setCertificateData({
        certificate: data.certificate,
        course: data.course,
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      await generateCertificatePDF(
        data.certificate,
        data.course,
        "admin-certificate",
      );

      setCertificateData(null);
    } catch (error) {
      console.error("Error downloading certificate:", error);
      alert("Failed to download certificate. Check console for details.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const getUsersData = async () => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      console.log(data.users.data);
      setUsers(data.users.data);
    } catch (error) {
      console.error("Error fetching users data:", error);
    }
  };

  return (
    <div className="p-8 rounded-lg shadow-md w-full">
      <BackToTopBtn />
      <h1 className="text-3xl font-bold">Admin Users Page</h1>
      <p className="mt-4 text-gray-600">
        This is the admin users page. Here you can manage all the users of the
        platform.
      </p>

      <div className="mt-6">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="py-3 px-4 bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Sr
              </th>
              <th className="py-3 px-4 bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                User id
              </th>
              <th className="py-3 px-4 bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Avatar
              </th>
              <th className="py-3 px-4 bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Name
              </th>
              <th className="py-3 px-4 bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Email
              </th>
              <th className="py-3 px-4 bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Enrollment no
              </th>
              <th className="py-3 px-4 bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Phone no
              </th>
              <th className="py-3 px-4 bg-gray-100 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user, index) => (
              <tr
                className="border-t border-gray-200 hover:bg-gray-50"
                key={user.id}
              >
                <td className="py-4 px-4 text-sm text-gray-900">{index + 1}</td>
                <td className="py-4 px-4 text-sm text-gray-900">{user.id}</td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  <Image
                    width={40}
                    height={40}
                    src={user?.imageUrl || "/brand.png"}
                    alt="User Photo"
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {user?.firstName || "No first name"}{" "}
                  {user?.lastName || "No last name"}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {user?.emailAddresses?.[0]?.emailAddress || "No email"}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {user?.publicMetadata.enrNumber || "No enrollment number"}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {user?.publicMetadata?.phoneNumber || "No phone number"}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  <button
                    onClick={() => handleUserClick(user.id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2"
                  >
                    View
                  </button>
                  <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {certificateData && (
        <div style={{ position: "fixed", left: "-10000px", top: 0 }}>
          <div id="admin-certificate">
            <CertificateTemplate
              certificate={certificateData.certificate}
              course={certificateData.course}
            />
          </div>
        </div>
      )}

      {showModal && userDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-2/3 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">User Details</h2>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">User ID:</span> {selectedUser}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-semibold">Total Enrollments:</span>{" "}
                {userDetails.length}
              </p>
            </div>

            <h3 className="text-lg font-semibold mb-3">Enrolled Courses</h3>

            <div className="space-y-4">
              {userDetails?.map((enrollment: CourseEnrollment) => (
                <div
                  key={enrollment.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg text-gray-800">
                        {enrollment.courses?.title || "No course title"}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Instructor: {enrollment.courses?.instructor || "N/A"}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        enrollment.completed
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {enrollment.completed ? "Completed" : "In Progress"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Course ID:</span>
                      <p className="font-mono text-xs text-gray-700">
                        {enrollment.course_id}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Enrolled:</span>
                      <p className="text-gray-700">
                        {new Date(enrollment.enrolled_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                    {enrollment.completed_at && (
                      <div>
                        <span className="text-gray-500">Completed:</span>
                        <p className="text-gray-700">
                          {new Date(enrollment.completed_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <p className="text-gray-700">
                        {Math.floor(
                          enrollment.courses?.total_duration_seconds / 3600,
                        )}
                        h{" "}
                        {Math.floor(
                          (enrollment.courses?.total_duration_seconds % 3600) /
                            60,
                        )}
                        m
                      </p>
                    </div>
                  </div>

                  {enrollment.completed && (
                    <button
                      onClick={() =>
                        handleDownloadCertificate(
                          selectedUser,
                          enrollment.course_id,
                        )
                      }
                      disabled={isGeneratingPDF}
                      className="w-full bg-green-500 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
                    >
                      {isGeneratingPDF ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Generating PDF...
                        </>
                      ) : (
                        <>
                          <DownloadIcon className="h-4 w-4 inline mr-2" />
                          Download Certificatee
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
