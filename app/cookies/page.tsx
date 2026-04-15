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
              Cookie Policy for vSpringboard
            </h1>
            <h3 className="text-xl font-semibold">
              Last Updated: April 14, 2026
            </h3>
            <p className="text-base md:text-lg">
              This Cookie Policy explains how vSpringboard (&quot;we,&quot;
              &quot;our,&quot; or &quot;us&quot;) uses cookies and similar local
              storage technologies on our platform accessible at
              vspringboard.vercel.app.
            </p>
            <p className="text-base md:text-lg">
              By continuing to use vSpringboard, you agree to our use of cookies
              and local storage as described in this policy.
            </p>
          </div>

          <hr className="text-gray-400" />

          <div className="flex flex-col gap-4" id="1.0">
            <h2 className="text-2xl md:text-3xl font-semibold">
              1. What Are Cookies?
            </h2>
            <p className="text-base md:text-lg">
              Cookies are small text files placed on your device by a website
              when you visit it. They are widely used to make websites work more
              efficiently and to provide information to the owners of the site.
              Cookies can be &quot;session cookies&quot; (deleted when you close
              your browser) or &quot;persistent cookies&quot; (remaining on your
              device for a set period or until you delete them).
            </p>
            <p className="text-base md:text-lg">
              We also use <span className="font-semibold">Local Storage</span>,
              a browser-based mechanism similar to cookies that allows us to
              store slightly larger amounts of data on your device without an
              expiry date.
            </p>
          </div>

          <hr />

          <div className="flex flex-col gap-4" id="2.0">
            <h2 className="text-2xl md:text-3xl font-semibold">
              2. How We Use Cookies and Local Storage
            </h2>
            <p className="text-base md:text-lg">
              vSpringboard uses cookies and local storage exclusively to improve
              your learning experience. We do not use cookies for advertising or
              to track you across other websites.
            </p>

            <h3 className="md:text-2xl text-xl font-semibold">
              2.1 Local Storage — Course Progress
            </h3>
            <p className="text-base md:text-lg">
              We store your overall course progress locally in your browser
              using Local Storage. This allows you to resume where you left off
              without needing to re-fetch progress data from our servers on
              every page load.
            </p>
            <ul className="list-disc list-inside">
              <li className="text-base md:text-lg">
                <span className="font-semibold">Purpose:</span> Seamless
                learning experience and fast progress tracking
              </li>
              <li className="text-base md:text-lg">
                <span className="font-semibold">Data stored:</span> Which
                courses and modules you have completed or started
              </li>
              <li className="text-base md:text-lg">
                <span className="font-semibold">Type:</span> Persistent (stored
                until you clear your browser data or delete your account)
              </li>
              <li className="text-base md:text-lg">
                <span className="font-semibold">Third-party access:</span> None
                — this data stays in your browser only
              </li>
            </ul>

            <h3 className="md:text-2xl text-xl font-semibold">
              2.2 Cookies — Per-Video Progress
            </h3>
            <p className="text-base md:text-lg">
              We use or plan to use cookies to save your playback position
              within individual course videos. This ensures that if you leave a
              video partway through, you can pick up from exactly where you
              stopped.
            </p>
            <ul className="list-disc list-inside">
              <li className="text-base md:text-lg">
                <span className="font-semibold">Purpose:</span> Saving per-video
                watch progress so you never lose your place
              </li>
              <li className="text-base md:text-lg">
                <span className="font-semibold">Data stored:</span> Video ID and
                timestamp (playback position in seconds)
              </li>
              <li className="text-base md:text-lg">
                <span className="font-semibold">Type:</span> Persistent session
                cookie (until cleared by the user or browser)
              </li>
              <li className="text-base md:text-lg">
                <span className="font-semibold">Third-party access:</span> None
                — this data is used solely within vSpringboard
              </li>
            </ul>
          </div>

          <hr />

          <div className="flex flex-col gap-4" id="3.0">
            <h2 className="text-2xl md:text-3xl font-semibold">
              3. Third-Party Cookies
            </h2>
            <p className="text-base md:text-lg">
              In addition to our own cookies and local storage, certain
              third-party services integrated into vSpringboard may set their
              own cookies on your device:
            </p>

            <h3 className="md:text-2xl text-xl font-semibold">
              3.1 Google Analytics 4
            </h3>
            <ul className="list-disc list-inside">
              <li className="text-base md:text-lg">
                Used to collect aggregated, anonymous data about how users
                interact with our platform
              </li>
              <li className="text-base md:text-lg">
                These cookies do not identify you personally
              </li>
              <li className="text-base md:text-lg">
                Governed by{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-600"
                >
                  Google&apos;s Privacy Policy
                </a>
              </li>
            </ul>

            <h3 className="md:text-2xl text-xl font-semibold">
              3.2 Clerk (Authentication)
            </h3>
            <ul className="list-disc list-inside">
              <li className="text-base md:text-lg">
                Clerk may set session cookies to keep you securely signed in via
                email OTP or Google OAuth
              </li>
              <li className="text-base md:text-lg">
                Governed by{" "}
                <a
                  href="https://clerk.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-600"
                >
                  Clerk&apos;s Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <hr />

          <div className="flex flex-col gap-4" id="4.0">
            <h2 className="text-2xl md:text-3xl font-semibold">
              4. Managing Cookies and Local Storage
            </h2>
            <p className="text-base md:text-lg">
              You have several options to control cookies and local storage:
            </p>

            <h3 className="md:text-2xl text-xl font-semibold">
              4.1 Browser Settings
            </h3>
            <p className="text-base md:text-lg">
              Most browsers allow you to view, block, or delete cookies and
              clear local storage data. Refer to your browser&apos;s help
              documentation for instructions:
            </p>
            <ul className="list-disc list-inside">
              <li className="text-base md:text-lg">
                <span className="font-semibold">Chrome:</span> Settings →
                Privacy and Security → Cookies and other site data
              </li>
              <li className="text-base md:text-lg">
                <span className="font-semibold">Firefox:</span> Settings →
                Privacy &amp; Security → Cookies and Site Data
              </li>
              <li className="text-base md:text-lg">
                <span className="font-semibold">Safari:</span> Preferences →
                Privacy → Manage Website Data
              </li>
              <li className="text-base md:text-lg">
                <span className="font-semibold">Edge:</span> Settings → Cookies
                and site permissions
              </li>
            </ul>

            <h3 className="md:text-2xl text-xl font-semibold">
              4.2 Impact of Disabling Cookies
            </h3>
            <p className="text-base md:text-lg">
              Please be aware that disabling cookies or clearing local storage
              may affect certain platform features:
            </p>
            <ul className="list-disc list-inside">
              <li className="text-base md:text-lg">
                Your per-video watch progress will not be saved between sessions
              </li>
              <li className="text-base md:text-lg">
                Your locally cached course progress may be lost, though progress
                synced to our servers will remain unaffected
              </li>
              <li className="text-base md:text-lg">
                You may be required to sign in again more frequently if
                authentication cookies are cleared
              </li>
            </ul>
          </div>

          <hr />

          <div className="flex flex-col gap-4" id="5.0">
            <h2 className="text-2xl md:text-3xl font-semibold">
              5. Updates to This Cookie Policy
            </h2>
            <p className="text-base md:text-lg">
              We may update this Cookie Policy from time to time. Any changes
              will be reflected by updating the &quot;Last Updated&quot; date at
              the top of this page. We encourage you to review this policy
              periodically to stay informed about how we use cookies.
            </p>
          </div>

          <hr />

          <div className="flex flex-col gap-4" id="6.0">
            <h2 className="text-2xl md:text-3xl font-semibold">
              6. Contact Us
            </h2>
            <p className="text-base md:text-lg">
              If you have any questions about our use of cookies or local
              storage, please contact us:
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
              What Are Cookies?
            </a>
            <a
              className="border-l border-gray-200 pl-2 text-gray-700"
              href="#2.0"
            >
              How We Use Cookies and Local Storage
            </a>
            <a
              className="border-l border-gray-200 pl-2 text-gray-700"
              href="#3.0"
            >
              Third-Party Cookies
            </a>
            <a
              className="border-l border-gray-200 pl-2 text-gray-700"
              href="#4.0"
            >
              Managing Cookies and Local Storage
            </a>
            <a
              className="border-l border-gray-200 pl-2 text-gray-700"
              href="#5.0"
            >
              Updates to This Cookie Policy
            </a>
            <a
              className="border-l border-gray-200 pl-2 text-gray-700"
              href="#6.0"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
