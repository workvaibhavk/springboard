import DNavbar from "@/page_components/DNavbar";
import BackToTopBtn from "@/page_components/backToTopBtn";

export default function Page() {
  return (
    <>
      <DNavbar />
      <BackToTopBtn />
      <div className="w-11/12 mx-auto flex justify-center gap-8">
        <div className="md:w-7/12 my-8 md:my-20 flex flex-col gap-8 text-xl">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Terms &amp; Conditions for vSpringboard
            </h1>
            <h3 className="text-xl font-semibold">
              Last Updated: April 14, 2026
            </h3>
            <p className="text-base md:text-lg">
              Welcome to vSpringboard (&quot;we,&quot; &quot;our,&quot; or
              &quot;us&quot;). By accessing or using our platform at
              vspringboard.vercel.app, you agree to be bound by these Terms
              &amp; Conditions. Please read them carefully before using our
              services.
            </p>
            <p className="text-base md:text-lg">
              If you do not agree to these terms, please discontinue use of
              vSpringboard immediately.
            </p>
          </div>

          <hr className="text-gray-400" />

          <div className="flex flex-col gap-4" id="1.0">
            <h2 className="text-2xl md:text-3xl font-semibold">
              1. Acceptance of Terms
            </h2>
            <p className="text-base md:text-lg">
              By registering for an account or using any part of the
              vSpringboard platform, you confirm that:
            </p>
            <ul className="list-disc list-inside">
              <li className="text-base md:text-lg">
                You have read, understood, and agree to these Terms &amp;
                Conditions
              </li>
              <li className="text-base md:text-lg">
                You agree to our{" "}
                <a href="/privacy" className="underline text-blue-600">
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a href="/cookies" className="underline text-blue-600">
                  Cookie Policy
                </a>
              </li>
              <li className="text-base md:text-lg">
                You are legally capable of entering into a binding agreement
              </li>
            </ul>
          </div>

          <hr />

          <div className="flex flex-col gap-4" id="2.0">
            <h2 className="text-2xl md:text-3xl font-semibold">
              2. Use of the Platform
            </h2>

            <h3 className="md:text-2xl text-xl font-semibold">
              2.1 Eligibility
            </h3>
            <p className="text-base md:text-lg">
              vSpringboard is open to users of all ages. Users under the age of
              18 are encouraged to use the platform under parental guidance. By
              creating an account, you represent that the information you
              provide is accurate and complete.
            </p>

            <h3 className="md:text-2xl text-xl font-semibold">
              2.2 Account Responsibilities
            </h3>
            <ul className="list-disc list-inside">
              <li className="text-base md:text-lg">
                You are responsible for maintaining the confidentiality of your
                account credentials
              </li>
              <li className="text-base md:text-lg">
                You are responsible for all activity that occurs under your
                account
              </li>
              <li className="text-base md:text-lg">
                You must notify us immediately at itsvaibhav.work@gmail.com if
                you suspect unauthorized access to your account
              </li>
              <li className="text-base md:text-lg">
                You may not share your account with or transfer it to another
                person
              </li>
            </ul>

            <h3 className="md:text-2xl text-xl font-semibold">
              2.3 Prohibited Conduct
            </h3>
            <p className="text-base md:text-lg">
              When using vSpringboard, you agree not to:
            </p>
            <ul className="list-disc list-inside">
              <li className="text-base md:text-lg">
                Attempt to gain unauthorized access to any part of the platform
                or its systems
              </li>
              <li className="text-base md:text-lg">
                Use the platform for any unlawful purpose or in violation of any
                applicable laws
              </li>
              <li className="text-base md:text-lg">
                Reproduce, redistribute, or resell any course content without
                explicit written permission
              </li>
              <li className="text-base md:text-lg">
                Interfere with or disrupt the integrity or performance of the
                platform
              </li>
              <li className="text-base md:text-lg">
                Upload or transmit viruses, malware, or any other harmful code
              </li>
            </ul>
          </div>

          <hr />

          <div className="flex flex-col gap-4" id="3.0">
            <h2 className="text-2xl md:text-3xl font-semibold">
              3. Course Enrollment and Access
            </h2>

            <h3 className="md:text-2xl text-xl font-semibold">
              3.1 Course Availability
            </h3>
            <p className="text-base md:text-lg">
              We reserve the right to modify, suspend, or discontinue any course
              or content at any time without prior notice. We will make
              reasonable efforts to inform enrolled users of significant
              changes.
            </p>

            <h3 className="md:text-2xl text-xl font-semibold">
              3.2 Course Access
            </h3>
            <ul className="list-disc list-inside">
              <li className="text-base md:text-lg">
                Upon enrollment, you are granted a limited, non-exclusive,
                non-transferable license to access and view course content for
                personal, non-commercial educational purposes
              </li>
              <li className="text-base md:text-lg">
                Course content may only be accessed through the vSpringboard
                platform and may not be downloaded, screen-recorded, or
                reproduced without permission
              </li>
              <li className="text-base md:text-lg">
                Access to a course does not expire as long as your account
                remains active and the course is available on the platform
              </li>
            </ul>

            <h3 className="md:text-2xl text-xl font-semibold">
              3.3 Progress Tracking
            </h3>
            <p className="text-base md:text-lg">
              Your course progress is tracked automatically as you complete
              lessons and modules. Progress is stored both in our secure
              Supabase database and locally in your browser for performance. We
              are not responsible for progress data lost due to browser cache
              clearance or local storage deletion.
            </p>
          </div>

          <hr />

          <div className="flex flex-col gap-4" id="4.0">
            <h2 className="text-2xl md:text-3xl font-semibold">
              4. Certificates of Completion
            </h2>

            <h3 className="md:text-2xl text-xl font-semibold">
              4.1 Eligibility for Certificates
            </h3>
            <p className="text-base md:text-lg">
              Upon successfully completing all required modules and lessons
              within a course, you will be eligible to receive a vSpringboard
              Certificate of Completion. Completion is determined solely by our
              platform&apos;s progress tracking system.
            </p>

            <h3 className="md:text-2xl text-xl font-semibold">
              4.2 Certificate Issuance
            </h3>
            <ul className="list-disc list-inside">
              <li className="text-base md:text-lg">
                Certificates are issued digitally and are accessible from your
                profile on the platform
              </li>
              <li className="text-base md:text-lg">
                Each certificate includes your full name, the course title, and
                the date of completion
              </li>
              <li className="text-base md:text-lg">
                You are responsible for ensuring that your registered full name
                is accurate before completing a course, as this name will appear
                on your certificate
              </li>
            </ul>

            <h3 className="md:text-2xl text-xl font-semibold">
              4.3 Validity and Limitations
            </h3>
            <ul className="list-disc list-inside">
              <li className="text-base md:text-lg">
                vSpringboard certificates are issued as recognition of course
                completion on our platform and are not equivalent to
                government-recognized qualifications, professional
                certifications, or academic degrees
              </li>
              <li className="text-base md:text-lg">
                We make no guarantees regarding the acceptance or recognition of
                our certificates by any employer, institution, or third party
              </li>
              <li className="text-base md:text-lg">
                Certificates remain available as long as your account is active.
                Deleting your account will result in permanent loss of all
                issued certificates
              </li>
            </ul>

            <h3 className="md:text-2xl text-xl font-semibold">
              4.4 Certificate Integrity
            </h3>
            <ul className="list-disc list-inside">
              <li className="text-base md:text-lg">
                Certificates must not be altered, falsified, or misrepresented
                in any way
              </li>
              <li className="text-base md:text-lg">
                Any attempt to fraudulently obtain a certificate (e.g., by
                manipulating progress data) will result in immediate account
                termination and revocation of all certificates
              </li>
            </ul>
          </div>

          <hr />

          <div className="flex flex-col gap-4" id="5.0">
            <h2 className="text-2xl md:text-3xl font-semibold">
              5. Intellectual Property
            </h2>
            <p className="text-base md:text-lg">
              All content on vSpringboard — including but not limited to course
              videos, materials, text, graphics, logos, and the platform
              interface — is the intellectual property of vSpringboard or its
              content contributors, and is protected by applicable copyright
              laws.
            </p>
            <ul className="list-disc list-inside">
              <li className="text-base md:text-lg">
                You may not copy, reproduce, distribute, or create derivative
                works from any platform content without explicit written
                permission
              </li>
              <li className="text-base md:text-lg">
                Personal use of course materials for learning purposes is
                permitted within the platform only
              </li>
            </ul>
          </div>

          <hr />

          <div className="flex flex-col gap-4" id="6.0">
            <h2 className="text-2xl md:text-3xl font-semibold">
              6. Account Termination
            </h2>

            <h3 className="md:text-2xl text-xl font-semibold">
              6.1 Termination by You
            </h3>
            <p className="text-base md:text-lg">
              You may delete your account at any time from your profile
              settings. Upon deletion, all your personal data, progress, and
              certificates will be immediately and permanently removed from our
              systems, in accordance with our{" "}
              <a href="/privacy" className="underline text-blue-600">
                Privacy Policy
              </a>
              .
            </p>

            <h3 className="md:text-2xl text-xl font-semibold">
              6.2 Termination by Us
            </h3>
            <p className="text-base md:text-lg">
              We reserve the right to suspend or terminate your account at our
              discretion if we determine that you have violated these Terms
              &amp; Conditions. In such cases:
            </p>
            <ul className="list-disc list-inside">
              <li className="text-base md:text-lg">
                We will make reasonable efforts to notify you via your
                registered email address
              </li>
              <li className="text-base md:text-lg">
                All certificates issued to your account may be revoked
              </li>
              <li className="text-base md:text-lg">
                You will lose access to all enrolled courses
              </li>
            </ul>
          </div>

          <hr />

          <div className="flex flex-col gap-4" id="7.0">
            <h2 className="text-2xl md:text-3xl font-semibold">
              7. Disclaimers and Limitation of Liability
            </h2>

            <h3 className="md:text-2xl text-xl font-semibold">
              7.1 Platform Availability
            </h3>
            <p className="text-base md:text-lg">
              We strive to keep vSpringboard available at all times but do not
              guarantee uninterrupted or error-free access. We are not liable
              for any loss or inconvenience caused by downtime, technical
              issues, or maintenance.
            </p>

            <h3 className="md:text-2xl text-xl font-semibold">
              7.2 Content Accuracy
            </h3>
            <p className="text-base md:text-lg">
              While we aim to provide accurate and up-to-date course content, we
              make no warranties regarding the completeness, reliability, or
              suitability of the content for any particular purpose.
            </p>

            <h3 className="md:text-2xl text-xl font-semibold">
              7.3 Limitation of Liability
            </h3>
            <p className="text-base md:text-lg">
              To the fullest extent permitted by law, vSpringboard shall not be
              liable for any indirect, incidental, special, or consequential
              damages arising from your use of, or inability to use, the
              platform or its content.
            </p>
          </div>

          <hr />

          <div className="flex flex-col gap-4" id="8.0">
            <h2 className="text-2xl md:text-3xl font-semibold">
              8. Governing Law
            </h2>
            <p className="text-base md:text-lg">
              These Terms &amp; Conditions are governed by and construed in
              accordance with the laws of India. Any disputes arising from or
              relating to these terms shall be subject to the exclusive
              jurisdiction of the courts of Maharashtra, India.
            </p>
          </div>

          <hr />

          <div className="flex flex-col gap-4" id="9.0">
            <h2 className="text-2xl md:text-3xl font-semibold">
              9. Updates to These Terms
            </h2>
            <p className="text-base md:text-lg">
              We may revise these Terms &amp; Conditions at any time. We will
              notify you of significant changes by posting the updated terms on
              our platform and updating the &quot;Last Updated&quot; date at the
              top of this page. Your continued use of vSpringboard after changes
              are posted constitutes your acceptance of the revised terms.
            </p>
          </div>

          <hr />

          <div className="flex flex-col gap-4" id="10.0">
            <h2 className="text-2xl md:text-3xl font-semibold">
              10. Contact Us
            </h2>
            <p className="text-base md:text-lg">
              If you have any questions or concerns about these Terms &amp;
              Conditions, please contact us:
            </p>
            <p className="text-base md:text-lg">
              <span className="font-semibold">Email:</span>{" "}
              itsvaibhav.work@gmail.com <br />
              <span className="font-semibold">Phone:</span> +91 95039 84002{" "}
              <br />
              <span className="font-semibold">Website:</span>{" "}
              vspringboard.vercel.app <br />
              <span className="font-semibold">Location:</span> Maharashtra,
              India
            </p>
          </div>

          <hr />

          <div>
            <h2 className="text-3xl font-semibold">vSpringboard</h2>
            <p className="text-base md:text-lg">
              Reimagining online learning with better UI/UX
            </p>
            <p className="text-base md:text-lg">Maharashtra, India</p>
          </div>
        </div>

        {/* Sticky ToC */}
        <div className="my-20 hidden md:block sticky top-0">
          <h3 className="text-xl font-semibold mb-2">On this page</h3>
          <div className="flex flex-col">
            <a
              className="border-l border-gray-200 pl-2 text-gray-700"
              href="#1.0"
            >
              Acceptance of Terms
            </a>
            <a
              className="border-l border-gray-200 pl-2 text-gray-700"
              href="#2.0"
            >
              Use of the Platform
            </a>
            <a
              className="border-l border-gray-200 pl-2 text-gray-700"
              href="#3.0"
            >
              Course Enrollment and Access
            </a>
            <a
              className="border-l border-gray-200 pl-2 text-gray-700"
              href="#4.0"
            >
              Certificates of Completion
            </a>
            <a
              className="border-l border-gray-200 pl-2 text-gray-700"
              href="#5.0"
            >
              Intellectual Property
            </a>
            <a
              className="border-l border-gray-200 pl-2 text-gray-700"
              href="#6.0"
            >
              Account Termination
            </a>
            <a
              className="border-l border-gray-200 pl-2 text-gray-700"
              href="#7.0"
            >
              Disclaimers and Limitation of Liability
            </a>
            <a
              className="border-l border-gray-200 pl-2 text-gray-700"
              href="#8.0"
            >
              Governing Law
            </a>
            <a
              className="border-l border-gray-200 pl-2 text-gray-700"
              href="#9.0"
            >
              Updates to These Terms
            </a>
            <a
              className="border-l border-gray-200 pl-2 text-gray-700"
              href="#10.0"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
