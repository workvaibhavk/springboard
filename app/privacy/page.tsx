// import Link from "next/link";

export default function Page() {
    return (
        <div className=" flex justify-center gap-8">
            <div className="w-7/12 my-20 flex flex-col gap-8 text-xl">
                <div className="flex flex-col gap-4">
                    <h1 className="text-4xl font-semibold">Privacy Policy for vSpringboard</h1>
                    <h3 className="text-xl font-semibold">Last Updated: January 22, 2026</h3>
                    <p>Welcome to vSpringboard (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and ensuring transparency about how we collect, use, and safeguard your personal information. This Privacy Policy explains our practices regarding data collection and usage on our platform accessible at vspringboard.vercel.app.</p>
                    <p>By using vSpringboard, you agree to the collection and use of information in accordance with this policy.</p>
                </div>
                <hr className="text-gray-400" />

                <div className="flex flex-col gap-4">

                    <h2 className="text-3xl font-semibold">1. Information We Collect</h2>
                    <h3 className="text-2xl font-semibold">1.1 Personal Information</h3>
                    <p>When you register and use vSpringboard, we collect the following personal information:</p>
                    <ul className="list-disc list-inside" >
                        <li>Full Name</li>
                        <li>Email Address</li>
                        <li>Phone Number</li>
                        <li>Enrollment Number (Roll Number)</li>
                    </ul>

                    <h3 className="text-2xl font-semibold">1.2 Automatically Collected Information</h3>
                    <p>We automatically collect certain technical information when you use our platform:</p>
                    <ul className="list-disc list-inside" >
                        <li>IP Address (to understand geographic usage of our platform)</li>
                        <li>Device information and browser type</li>
                        <li>Usage data and interaction patterns with our platform</li>
                    </ul>

                    <h3 className="text-2xl font-semibold">1.3 Local Storage and Cookies</h3>
                    <ul className="list-disc list-inside" >
                        <li><span>Local Storage:</span> We store your course progress locally in your browser to provide a seamless learning experience</li>
                        <li><span>Cookies:</span> We use or plan to use cookies to store per-video progress and enhance your user experience</li>
                    </ul>

                    <h3 className="text-2xl font-semibold">1.4 Analytics Data</h3>
                    <p>We use Google Analytics 4 (GA4) to collect aggregated usage statistics to improve our platform and understand how users interact with our services.</p>
                </div>

                <hr />

                <div className="flex flex-col gap-4">
                    <h2 className="text-3xl font-semibold">2. How We Use Your Information</h2>
                    <p>We use the collected information for the following purposes:</p>

                    <h3 className="text-2xl font-semibold">2.1 Service Provision</h3>
                    <ul className="list-disc list-inside" >
                        <li>To create and manage your account</li>
                        <li>To track and display your course progress</li>
                        <li>To generate certificates upon course completion</li>
                        <li>To provide a personalized learning experience</li>
                    </ul>

                    <h3 className="text-2xl font-semibold">2.2 Communication</h3>
                    <ul className="list-disc list-inside" >
                        <li>To send you updates about upcoming courses and events</li>
                        <li>To make personal calls regarding new learning opportunities</li>
                        <li>To respond to your inquiries and provide support</li>
                    </ul>

                    <h3 className="text-2xl font-semibold">2.3 Platform Improvement</h3>
                    <ul className="list-disc list-inside" >
                        <li>To analyze usage patterns through our recommendation algorithm</li>
                        <li>To improve our user interface and user experience</li>
                        <li>To understand geographic distribution of our users</li>
                        <li>To optimize platform performance</li>
                    </ul>
                </div>

                <hr />

                <div className="flex flex-col gap-4">


                    <h2 className="text-3xl font-semibold">
                        3. Data Storage and Security
                    </h2>

                    <h3 className="text-2xl font-semibold">3.1 Data Storage</h3>
                    <ul className="list-disc list-inside" >
                        <li>All user data is securely stored in Supabase databases located in India</li>
                        <li>We implement industry-standard security measures to protect your information</li>
                    </ul>

                    <h3 className="text-2xl font-semibold">3.2 Authentication</h3>
                    <p>We use Clerk authentication services to secure your account through:</p>
                    <ul className="list-disc list-inside" >
                        <li>Email OTP (One-Time Password) verification</li>
                        <li>Google OAuth integration for convenient sign-in</li>
                    </ul>

                    <h3 className="text-2xl font-semibold">3.3 Data Retention</h3>
                    <ul className="list-disc list-inside" >
                        <li>We retain your data only as long as your account is active</li>
                        <li>Upon account deletion, your data is immediately and permanently removed from our systems</li>
                    </ul>
                </div>

                <hr />

                <div className="flex flex-col gap-4">

                    <h2 className="text-3xl font-semibold">4. Third-Party Services</h2>
                    <p>We use the following third-party services that may collect information:</p>

                    <h3 className="text-2xl font-semibold">4.1 Clerk (Authentication)</h3>
                    <ul className="list-disc list-inside" >
                        <li>Used for secure user authentication via email OTP and Google login</li>
                        <li>Subject to Clerk&apos;s privacy policy</li>
                    </ul>

                    <h3 className="text-2xl font-semibold">4.2 Google Analytics 4</h3>
                    <ul className="list-disc list-inside" >
                        <li>Used for anonymous usage analytics and platform improvement</li>
                        <li>Subject to Google&apos;s privacy policy</li>
                    </ul>

                    <h3 className="text-2xl font-semibold">4.3 Supabase (Database Hosting)</h3>
                    <ul className="list-disc list-inside" >
                        <li>Used for secure data storage in India region</li>
                        <li>Subject to Supabase&apos;s privacy policy</li>
                    </ul>

                    <h3 className="text-2xl font-semibold">We do not sell, rent, or share your personal information with any other third parties.</h3>
                </div>

                <hr />

                <div className="flex flex-col gap-4">


                    <h2 className="text-3xl font-semibold">5. Your Rights and Choices</h2>
                    <h3 className="text-2xl font-semibold">5.1 Account Deletion</h3>
                    <ul className="list-disc list-inside" >
                        <li>You have the right to delete your account at any time</li>
                        <li>All your personal data will be immediately and permanently removed from our systems upon deletion</li>
                    </ul>

                    <h3 className="text-2xl font-semibold">5.2 Data Access</h3>
                    <ul className="list-disc list-inside" >
                        <li>You can view all your personal data by navigating to your profile (hover over profile picture → Profile)</li>
                        <li>You have access to your course progress, certificates, and personal information</li>
                    </ul>

                    <h3 className="text-2xl font-semibold">5.3 Communication Preferences</h3>
                    <ul className="list-disc list-inside" >
                        <li>You can opt out of promotional communications by contacting us</li>
                        <li>Essential service-related communications may still be sent</li>
                    </ul>

                    <h3 className="text-2xl font-semibold">5.4 Cookies Management</h3>
                    <ul className="list-disc list-inside" >
                        <li>You can control cookie preferences through your browser settings</li>
                        <li>Disabling cookies may affect certain platform functionalities</li>
                    </ul>
                </div>

                <hr />

                <div className="flex flex-col gap-4">
                    <h2 className="text-3xl font-semibold">6. Children&apos;s Privacy</h2>
                    <p>vSpringboard does not have age restrictions. However, we are committed to protecting the privacy of all users, including minors. If you are under 18, we encourage you to use our platform with parental guidance.
                    </p>
                </div>

                <hr />

                <div className="flex flex-col gap-4">
                    <h2 className="text-3xl font-semibold">7. Updates to This Privacy Policy</h2>
                    <p>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any significant changes by:

                    </p>

                    <ul className="list-disc list-inside" >
                        <li>Posting the updated policy on our platform</li>
                        <li>Updating the &quot;Last Updated&quot; date at the top of this policy</li>
                    </ul>

                    <p>We encourage you to review this Privacy Policy periodically.</p>
                </div>

                <hr />

                <div className="flex flex-col gap-4">
                    <h2 className="text-3xl font-semibold">8. Data Protection and Compliance</h2>
                    <p>While vSpringboard is not a registered company, we are committed to following best practices in data protection and privacy. We take reasonable measures to ensure:</p>
                    <ul className="list-disc list-inside" >
                        <li>Secure data transmission and storage</li>
                        <li>Limited data collection to only what is necessary</li>
                        <li>Transparency in our data practices</li>
                        <li>Respect for user privacy rights</li>
                    </ul>
                </div>

                <hr />

                <div className="flex flex-col gap-4">
                    <h2 className="text-3xl font-semibold">9. International Users</h2>

                    <p>Our services are primarily designed for users in India, with data stored in Indian servers. If you access our platform from outside India, please be aware that your information may be transferred to and processed in India.
                    </p>
                </div>

                <hr />

                <div className="flex flex-col gap-4">
                    <h2 className="text-3xl font-semibold">10. Contact Us</h2>
                    <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                    </p>
                    <p>
                        <span>Email:</span> itsvaibhav.work@gmail.com
                        <span>Phone:</span> +91 9503984002
                        <span>Website:</span> vspringboard.vercel.app
                        <span>Location:</span> Maharashtra, India
                    </p>
                </div>

                <hr />
                <div className="flex flex-col gap-4">
                    <h2 className="text-3xl font-semibold">
                        11. Your Consent
                    </h2>

                    <p>By using vSpringboard, you acknowledge that you have read and understood this Privacy Policy and consent to the collection, use, and storage of your information as described herein.
                    </p>
                </div>

                <hr />

                <div>
                    <h2 id="id" className="text-3xl font-semibold">vSpringboard</h2>
                    <p>Reimagining online learning with better UI/UX</p>
                    <p>Maharashtra, India</p>
                </div>


            </div>
            <div className="my-20 sticky">
                <h3 className="text-xl font-semibold mb-2">On this page</h3>

                <div className="flex flex-col">
                    <a className="border-l border-gray-200 pl-2 text-gray-700" href="#1.0">Information We Collect</a>
                    <a className="border-l border-gray-200 pl-2 text-gray-700" href="#2.0">How We Use Your Information</a>
                    <a className="border-l border-gray-200 pl-2 text-gray-700" href="#3.0">Data Storage and Security</a>
                    <a className="border-l border-gray-200 pl-2 text-gray-700" href="#4.0">Third-Party Services</a>
                    <a className="border-l border-gray-200 pl-2 text-gray-700" href="#5.0">Your Rights and Choices</a>
                    <a className="border-l border-gray-200 pl-2 text-gray-700" href="#6.0">Children&apos;s Privacy</a>
                    <a className="border-l border-gray-200 pl-2 text-gray-700" href="#7.0">Updates to This Privacy Policy</a>
                    <a className="border-l border-gray-200 pl-2 text-gray-700" href="#8.0">Data Protection and Compliance</a>
                    <a className="border-l border-gray-200 pl-2 text-gray-700" href="#9.0">International Users</a>
                    <a className="border-l border-gray-200 pl-2 text-gray-700" href="#10.0">Contact Us</a>
                    <a className="border-l border-gray-200 pl-2 text-gray-700" href="#11.0">Your Consent</a>
                </div>
            </div>
        </div>
    )
}