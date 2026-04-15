import BackToTopBtn from "@/page_components/backToTopBtn";
import DNavbar from "@/page_components/DNavbar";
import Image from "next/image";

export default function Page() {
  return (
    <>
      {" "}
      <DNavbar />
      <BackToTopBtn />
      <div className="min-h-screen flex flex-col py-12 gap-12 items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Commitment to Credibility
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            At Springboard, we are dedicated to providing high-quality education
            with transparent outcomes. Our instructors are industry experts, and
            our course content reflects the latest trends and technologies.
          </p>
          <p className="text-lg text-gray-700">
            We are committed to maintaining the highest standards of credibility
            and supporting you every step of the way. Thank you for choosing
            Springboard as your learning partner.
          </p>
        </div>

        <div className="bg-white flex flex-col md:flex-row justify-center items-center p-8 rounded-lg shadow-lg w-10/12 text-center">
          <Image
            src="/credibility.jpeg"
            alt="Credibility Image"
            width={450}
            height={300}
            className="mx-auto mb-6 rounded-lg shadow-md"
          />
          <div className="max-w-lg flex flex-col items-center gap-4">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Certificate Recognition
            </h1>
            <p className="text-lg text-gray-700">
              Springboard certificates are recognized and respected by educators
              at GPP and other renowned institutions, helping you advance your
              professional journey.
            </p>

            <div className="text-left w-full space-y-4 mt-4">
              <div className="border-l-4 border-[#665bca] pl-4">
                <p className="text-lg text-gray-700">
                  <span className="font-bold text-[#665bca]">
                    Mrs. Swati Sant
                  </span>
                  , Main Computer Science Lecturer at GPP and Theory teacher for
                  all batches, has acknowledged the credibility of Springboard
                  certificates and encourages students to pursue them for career
                  growth.
                </p>
              </div>

              <div className="border-l-4 border-[#665bca] pl-4">
                <p className="text-lg text-gray-700 mb-3">
                  <span className="font-bold text-[#665bca]">
                    Mrs. Sayali Pradeep Ambavane
                  </span>
                  , Main Computer Science Lecturer at GPP and Theory and
                  Practicals teacher for all batches in Programming in C, had a
                  talk with our founder{" "}
                  <span className="font-bold text-[#665bca]">
                    Mr. Vaibhav Kamble
                  </span>{" "}
                  on Thursday, February 5, 2026 at 11:29:55 AM{" "}
                  {"{UTC+05:30 82°30′ E}"} and acknowledged the credibility of
                  Springboard certificates:
                </p>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-left">
                  <p className="text-gray-800">
                    <span className="font-semibold text-[#665bca]">
                      Mr. Vaibhav:
                    </span>{" "}
                    <em>
                      &quot;Mam ha platform use kela tr chalel kay, Infosys
                      madhe certificates sathi problems yeto&quot;
                    </em>
                  </p>
                  <p className="text-gray-800">
                    <span className="font-semibold text-[#665bca]">
                      Mrs. Ambavane:
                    </span>{" "}
                    <em>&quot;Kay naav bollas&quot;</em>
                  </p>
                  <p className="text-gray-800">
                    <span className="font-semibold text-[#665bca]">
                      Mr. Vaibhav:
                    </span>{" "}
                    <em>&quot;vSpringboard&quot;</em>
                  </p>
                  <p className="text-gray-800">
                    <span className="font-semibold text-[#665bca]">
                      Mrs. Ambavane:
                    </span>{" "}
                    <em>&quot;Ok vSpringboard ahey na, ok chalel&quot;</em>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
