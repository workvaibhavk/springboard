import Image from "next/image";

export default function Page() {
    return (
        <div>
            <div className="min-h-screen flex flex-col py-12 gap-12 items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Commitment to Credibility</h1>
                    <p className="text-lg text-gray-700 mb-6">
                        At Springboard, we understand that choosing the right educational path is a significant decision. That&apos;s why we are dedicated to providing you with transparent, accurate, and up-to-date information about our courses, instructors, and outcomes. Our credibility is built on a foundation of trust, integrity, and a relentless commitment to your success.
                    </p>
                    <p className="text-lg text-gray-700 mb-6">
                        We rigorously vet our instructors, ensuring they are industry experts with real-world experience. Our course content is continuously updated to reflect the latest trends and technologies, and we provide clear outcomes and success stories from our graduates. We are here to support you every step of the way, and we take pride in being a trusted partner in your educational journey.
                    </p>
                    <p className="text-lg text-gray-700">
                        Your success is our success, and we are committed to maintaining the highest standards of credibility in everything we do. Thank you for choosing Springboard as your learning partner.
                    </p>
                </div>

                <div className="bg-white flex justify-center items-center p-8 rounded-lg shadow-lg w-10/12 text-center">


                    <Image
                        src="/credibility.jpeg"
                        alt="Credibility Image"
                        width={450}
                        height={300}
                        className="mx-auto mb-6 rounded-lg shadow-md"
                    />
                    <div className="max-w-lg flex flex-col items-center gap-1">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Credibility of Certificate</h1>
                        <p className="text-lg text-gray-700 mb-6">
                            For your kind information, Springboard certificates are widely recognized and respected by the Educators and lecturers at Gpp and various other reknwned colleges. Our certificates are designed to showcase your achievements and can be a valuable asset in your professional journey, helping you stand out to employers and advance your career.
                        </p>
                        <p className="text-lg text-gray-700 mb-6">
                            As Seen in the Screenshot, <span className="font-bold text-[#665bca]">Mrs Swati Sant Madam</span>, the Main Computer Science Lecturer Faculty at Gpp, and our Theory teacher for all batches and Praticals teacher for C batch at Web Page Designing using HTML has acknowledged the credibility of Springboard certificates and encourages students to pursue them for their career growth. This endorsement from a respected educator further reinforces the value and recognition of our certificates in the academic and professional world.
                        </p>
                        <p className="text-lg text-gray-700">

                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}