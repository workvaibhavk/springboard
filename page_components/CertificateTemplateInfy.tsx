import Image from "next/image";
import QRCode from "react-qr-code";
import { Certificate, Course } from "@/types";

interface CertificateTemplateProps {
  certificate: Certificate;
  course: Course;
}

export default function CertificateTemplateInfy({
  certificate,
  course,
}: CertificateTemplateProps) {
  return (
    <div
      id="certificate-infy"
      className="bg-white rounded-lg shadow-2xl relative overflow-hidden"
      style={{ width: "900px", height: "636px" }}
    >
      <div className="relative z-10 flex flex-col items-center justify- h-full px-16 pt-8 pb-12">
        <div className="text-center space-y-4 max-w-3xl">
          <div className="space-y-4 mb-2">
            <Image
              src="/spr.png"
              alt="vSpringboa"
              width={135}
              height={45}
              className="object-contain mx-auto"
            />
            <h1
              style={{ paddingBottom: "10px" }}
              className="text-3xl mt-10 mb-0 text-[#007CC3] uppercase tracking-wide overflow-x-hidden"
            >
              <span className="opacity-30 font-bold">| | | | | | &nbsp;</span>
              Course Completion Certificate{" "}
              <span className="opacity-30 font-bold">&nbsp;| | | | | | </span>
            </h1>
          </div>

          <div className="space-y-3 py-6">
            <p
              style={{ color: "#000000" }}
              className="text-base text-gray-800 font-normal leading-none"
            >
              {" "}
              The certicate is awarded to
            </p>
            <h2
              style={{ color: "#007CC3" }}
              className="text-3xl font-semibold text-[#007CC3] border-gray-300 inline-block mb-4 leading-none"
            >
              {certificate.user_name}
            </h2>
            <div className="space-y-2">
              <p
                style={{ color: "#000000" }}
                className="text-md text-gray-800 font-normal"
              >
                for successfully completing the course{" "}
              </p>
              <h3
                style={{ color: "#050505" }}
                className="text-xl font-semibold text-gray-800 leading-snug px-6"
              >
                {course.title.split(":")[0]?.trim()}
              </h3>
              <p
                style={{ color: "#000000" }}
                className="mb-8 text-md text-gray-800 font-normal"
              >
                on{" "}
                {new Date(certificate.issued_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <Image
              src="/infy.png"
              alt="IvSpringboard"
              width={288}
              height={51}
              className="object-contain mx-auto"
            />

            <p
              style={{ color: "#E66049" }}
              className="italic text-lg text-gray-800 font-medium"
            >
              Congratulations! You make us proud!{" "}
            </p>
          </div>

          <div className="absolute bottom-6 right-6 z-20 bg-white p-2 rounded-lg">
            <div className="pt-6 flex justify-center">
              <div className="text-center">
                <div className="max-w-lg">
                  <Image
                    src="/sign.png"
                    alt="ISignature"
                    width={150}
                    height={68}
                    className="object-contain mx-auto"
                  />
                </div>

                <div className="px-4">
                  <p
                    style={{ color: "#424242" }}
                    className="text-[12px] leading-none text-gray-600"
                  >
                    Satheesha B. Nanjappa <br /> Senior Vice President and Head{" "}
                    <br /> Education, Training and Assesment <br /> Infosys
                    Limited
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 z-20 p-2 rounded-lg">
        <QRCode
          size={190}
          value={`https://vspringboard.vercel.app/verify/${certificate.certificate_number}`}
          fgColor="#000000"
          level="H"
          viewBox="0 0 256 256"
        />
        <p
          style={{ color: "#000000" }}
          className="text-gray-800 mt-2 text-[12px] leading-none "
        >
          Issued on: {}
          {new Date(certificate.issued_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          })}
          <br />
          To verify, scan the QR code at{" "}
          <span
            style={{ color: "#0000ff", textDecoration: "underline" }}
            className="text-blue-600"
          >
            https://verify.onwingspan.com
          </span>
        </p>
      </div>
    </div>
  );
}
