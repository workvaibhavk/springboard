'use client';

import Image from "next/image";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import DNavbar from '@/page_components/DNavbar'
import Footer from '@/page_components/Footer'
import { CircleDollarSign, CodeXml, Fingerprint, Sparkles, SplinePointer } from 'lucide-react'

export default function page() {

    const { user, isLoaded } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && user) {

            const hasPhoneNumber = user.unsafeMetadata?.phoneNumber;
            const hasEnrNumber = user.unsafeMetadata?.enrNumber;

            if (!hasPhoneNumber || !hasEnrNumber) {
                router.push('/onboarding');
            }
        }
    }
        , [isLoaded, user, router]);

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div className='bg-[#fff]'>
            <DNavbar />
            <div className='h-[50vh] justify-center items-center flex flex-col gap-6 text-center w-11/12 md:w-10/12 mx-auto mt-20'>
                <h1 className='text-5xl font-semibold'>Which Skill To Conquer Today,  <span className='text-[#665bca]'> &Vaibhav&</span></h1>

                <p className='w-5/12'>Browse categories aII over the gIobe Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus ducimus dolore doloremque. Find the perfect course for you</p>

                <div className='flex gap-2'>
                    <div className='flex gap-2 bg-[#E9E9E9] py-1 px-3 rounded-3xl text-[#000000d4] '>
                        <SplinePointer />
                        <span className='font-medium'>
                            Design
                        </span>
                    </div>
                    <div className='flex gap-2 bg-[#E9E9E9] py-1 px-3 rounded-3xl text-[#000000d4] '>
                        <Fingerprint />
                        <span className='font-medium'>
                            Cyber Security
                        </span>
                    </div>
                    <div className='flex gap-2 bg-[#E9E9E9] py-1 px-3 rounded-3xl text-[#000000d4] '>
                        <CircleDollarSign />
                        <span className='font-medium'>
                            Business
                        </span>
                    </div>
                    <div className='flex gap-2 bg-[#E9E9E9] py-1 px-3 rounded-3xl text-[#000000d4] '>
                        <Sparkles />
                        <span className='font-medium'>
                            AiMl
                        </span>
                    </div>
                    <div className='flex gap-2 bg-[#E9E9E9] py-1 px-3 rounded-3xl text-[#000000d4] '>
                        <CodeXml />
                        <span className='font-medium'>
                            Programming
                        </span>
                    </div>
                </div>
            </div>

            <section className='w-11/12 md:w-11/12 m-auto'>
                {/* Courses Section */}
                <h2 className='text-4xl border-l-4 border-[#665bca] pl-4 font-bold my-7'>Featured Cources</h2>

                <div className="flex flex-wrap gap-5">
                    {/* Course Cards */}
                    <div className='course-card w-[290px] border-2 border-gray-300 rounded-xl p-3 mb-6'>
                        <Image
                            src="/Thumbnails/1.jpg"
                            alt='img'
                            width={325}
                            height={200}
                            className=' rounded-xl '
                        />
                        <div className="content flex flex-col justify-evenly h-52 ">
                            <div className="acx">
                                <p className='text-[#00159d]'>Certificated</p>
                                <p className='font-bold text-lg line-clamp-2'>JavaScript Algorithms & DSA</p>
                                <p>Code with Harry</p>
                            </div>
                            <div className='flex gap-2 font-semibold text-sm'>
                                <span className=' bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] '>Javascript</span><span className=' bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] '>DSA</span><span className=' bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] '>Algorithms</span>

                            </div>
                            <div className='font-semibold'>
                                <span>6hr 40min</span>
                                <span> |                    </span>
                                <span> Beginner</span>
                            </div>
                            <button className='py-2 width-full bg-[#665bc9] rounded-2xl font-semibold '>
                                Enroll Now
                            </button>
                        </div>
                    </div>

                    <div className='course-card w-[290px] border-2 border-gray-300 rounded-xl p-3 mb-6'>
                        <Image
                            src="/Thumbnails/2.jpg"
                            alt='img'
                            width={325}
                            height={200}
                            className=' rounded-xl '
                        />
                        <div className="content flex flex-col justify-evenly h-52 ">
                            <div className="acx">
                                <p className='text-[#00159d]'>Certificated</p>
                                <p className='font-bold text-lg line-clamp-2'>JavaScript Algorithms & DSA</p>
                                <p>Code with Harry</p>
                            </div>
                            <div className='flex gap-2 font-semibold text-sm'>
                                <span className=' bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] '>Javascript</span><span className=' bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] '>DSA</span><span className=' bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] '>Algorithms</span>

                            </div>
                            <div className='font-semibold'>
                                <span>6hr 40min</span>
                                <span> |                    </span>
                                <span> Beginner</span>
                            </div>
                            <button className='py-2 width-full bg-[#665bc9] rounded-2xl font-semibold '>
                                Enroll Now
                            </button>
                        </div>
                    </div>

                    <div className='course-card w-[290px] border-2 border-gray-300 rounded-xl p-3 mb-6'>
                        <Image
                            src="/Thumbnails/3.jpg"
                            alt='img'
                            width={325}
                            height={200}
                            className=' rounded-xl '
                        />
                        <div className="content flex flex-col justify-evenly h-52 ">
                            <div className="acx">
                                <p className='text-[#00159d]'>Certificated</p>
                                <p className='font-bold text-lg line-clamp-2'>JavaScript Algorithms & DSA</p>
                                <p>Code with Harry</p>
                            </div>
                            <div className='flex gap-2 font-semibold text-sm'>
                                <span className=' bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] '>Javascript</span><span className=' bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] '>DSA</span><span className=' bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] '>Algorithms</span>

                            </div>
                            <div className='font-semibold'>
                                <span>6hr 40min</span>
                                <span> |                    </span>
                                <span> Beginner</span>
                            </div>
                            <button className='py-2 width-full bg-[#665bc9] rounded-2xl font-semibold '>
                                Enroll Now
                            </button>
                        </div>
                    </div>

                    <div className='course-card w-[290px] border-2 border-gray-300 rounded-xl p-3 mb-6'>
                        <Image
                            src="/Thumbnails/4.jpg"
                            alt='img'
                            width={325}
                            height={200}
                            className=' rounded-xl '
                        />
                        <div className="content flex flex-col justify-evenly h-52 ">
                            <div className="acx">
                                <p className='text-[#00159d]'>Certificated</p>
                                <p className='font-bold text-lg line-clamp-1'>JavaScript Algorithms & DSA JavaScript DSAASD</p>
                                <p>Code with Harry</p>
                            </div>
                            <div className='flex gap-2 font-semibold text-sm'>
                                <span className=' bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] '>Javascript</span><span className=' bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] '>DSA</span><span className=' bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] '>Algorithms</span>

                            </div>
                            <div className='font-semibold'>
                                <span>6hr 40min</span>
                                <span> |                    </span>
                                <span> Beginner</span>
                            </div>
                            <button className='py-2 width-full bg-[#665bc9] rounded-2xl font-semibold '>
                                Enroll Now
                            </button>
                        </div>
                    </div>

                </div>

                <h2 className='text-4xl border-l-4 border-[#665bca] pl-4 font-bold my-7'>Featured Cources</h2>

                <div className="flex flex-wrap gap-5">

                    <div className='course-card w-[290px] border-2 border-gray-300 rounded-xl p-3 mb-6'>
                        <Image
                            src="/Thumbnails/5.jpg"
                            alt='img'
                            width={325}
                            height={200}
                            className=' rounded-xl '
                        />
                        <div className="content flex flex-col justify-evenly h-52 ">
                            <div className="acx">
                                <p className='text-[#00159d]'>Certificated</p>
                                <p className='font-bold text-lg line-clamp-2'>JavaScript Algorithms & DSA</p>
                                <p>Code with Harry</p>
                            </div>
                            <div className='flex gap-2 font-semibold text-sm'>
                                <span className=' bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] '>Javascript</span><span className=' bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] '>DSA</span><span className=' bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] '>Algorithms</span>

                            </div>
                            <div className='font-semibold'>
                                <span>6hr 40min</span>
                                <span> |                    </span>
                                <span> Beginner</span>
                            </div>
                            <button className='py-2 width-full bg-[#665bc9] rounded-2xl font-semibold '>
                                Enroll Now
                            </button>
                        </div>
                    </div>

                    <div className='course-card w-[290px] border-2 border-gray-300 rounded-xl p-3 mb-6'>
                        <Image
                            src="/Thumbnails/6.jpg"
                            alt='img'
                            width={325}
                            height={200}
                            className=' rounded-xl '
                        />
                        <div className="content flex flex-col justify-evenly h-52 ">
                            <div className="acx">
                                <p className='text-[#00159d]'>Certificated</p>
                                <p className='font-bold text-lg line-clamp-2'>JavaScript Algorithms & DSA</p>
                                <p>Code with Harry</p>
                            </div>
                            <div className='flex gap-2 font-semibold text-sm'>
                                <span className=' bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] '>Javascript</span><span className=' bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] '>DSA</span><span className=' bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] '>Algorithms</span>

                            </div>
                            <div className='font-semibold'>
                                <span>6hr 40min</span>
                                <span> |                    </span>
                                <span> Beginner</span>
                            </div>
                            <button className='py-2 width-full bg-[#665bc9] rounded-2xl font-semibold '>
                                Enroll Now
                            </button>
                        </div>
                    </div>

                    <div className='course-card w-[290px] border-2 border-gray-300 rounded-xl p-3 mb-6'>
                        <Image
                            src="/Thumbnails/6.jpg"
                            alt='img'
                            width={325}
                            height={200}
                            className=' rounded-xl '
                        />
                        <div className="content flex flex-col justify-evenly h-52 ">
                            <div className="acx">
                                <p className='text-[#00159d]'>Certificated</p>
                                <p className='font-bold text-lg line-clamp-2'>JavaScript Algorithms & DSA</p>
                                <p>Code with Harry</p>
                            </div>
                            <div className='flex gap-2 font-semibold text-sm'>
                                <span className=' bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] '>Javascript</span><span className=' bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] '>DSA</span><span className=' bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] '>Algorithms</span>

                            </div>
                            <div className='font-semibold'>
                                <span>6hr 40min</span>
                                <span> |                    </span>
                                <span> Beginner</span>
                            </div>
                            <button className='py-2 width-full bg-[#665bc9] rounded-2xl font-semibold '>
                                Enroll Now
                            </button>
                        </div>
                    </div>

                    <div className='course-card w-[290px] border-2 border-gray-300 rounded-xl p-3 mb-6'>
                        <Image
                            src="/Thumbnails/6.jpg"
                            alt='img'
                            width={325}
                            height={200}
                            className=' rounded-xl '
                        />
                        <div className="content flex flex-col justify-evenly h-52 ">
                            <div className="acx">
                                <p className='text-[#00159d]'>Certificated</p>
                                <p className='font-bold text-lg line-clamp-2'>JavaScript Algorithms & DSA</p>
                                <p>Code with Harry</p>
                            </div>
                            <div className='flex gap-2 font-semibold text-sm'>
                                <span className=' bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] '>Javascript</span><span className=' bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] '>DSA</span><span className=' bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] '>Algorithms</span>

                            </div>
                            <div className='font-semibold'>
                                <span>6hr 40min</span>
                                <span> |                    </span>
                                <span> Beginner</span>
                            </div>
                            <button className='py-2 width-full bg-[#665bc9] rounded-2xl font-semibold '>
                                Enroll Now
                            </button>
                        </div>
                    </div>

                </div>

                <h2 className='text-4xl border-l-4 border-[#665bca] pl-4 font-bold my-7'>Featured Cources</h2>

                <div className="flex flex-wrap gap-5">

                    <div className='course-card w-[290px] border-2 border-gray-300 rounded-xl p-3 mb-6'>
                        <Image
                            src="/Thumbnails/1.jpg"
                            alt='img'
                            width={325}
                            height={200}
                            className=' rounded-xl '
                        />
                        <div className="content flex flex-col justify-evenly h-52 ">
                            <div className="acx">
                                <p className='text-[#00159d]'>Certificated</p>
                                <p className='font-bold text-lg line-clamp-2'>JavaScript Algorithms & DSA</p>
                                <p>Code with Harry</p>
                            </div>
                            <div className='flex gap-2 font-semibold text-sm'>
                                <span className=' bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] '>Javascript</span><span className=' bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] '>DSA</span><span className=' bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] '>Algorithms</span>

                            </div>
                            <div className='font-semibold'>
                                <span>6hr 40min</span>
                                <span> |                    </span>
                                <span> Beginner</span>
                            </div>
                            <button className='py-2 width-full bg-[#665bc9] rounded-2xl font-semibold '>
                                Enroll Now
                            </button>
                        </div>
                    </div>

                    <div className='course-card w-[290px] border-2 border-gray-300 rounded-xl p-3 mb-6'>
                        <Image
                            src="/Thumbnails/1.jpg"
                            alt='img'
                            width={325}
                            height={200}
                            className=' rounded-xl '
                        />
                        <div className="content flex flex-col justify-evenly h-52 ">
                            <div className="acx">
                                <p className='text-[#00159d]'>Certificated</p>
                                <p className='font-bold text-lg line-clamp-1'>JavaScript Algorithms & DSA JavaScript DSAASD</p>
                                <p>Code with Harry</p>
                            </div>
                            <div className='flex gap-2 font-semibold text-sm'>
                                <span className=' bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] '>Javascript</span><span className=' bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] '>DSA</span><span className=' bg-[#E9E9E9] py-1 px-3 rounded-2xl text-[#000000d4] '>Algorithms</span>

                            </div>
                            <div className='font-semibold'>
                                <span>6hr 40min</span>
                                <span> |                    </span>
                                <span> Beginner</span>
                            </div>
                            <button className='py-2 width-full bg-[#665bc9] rounded-2xl font-semibold '>
                                Enroll Now
                            </button>
                        </div>
                    </div>
                </div>
            </section >

            <Footer />
        </div >
    )
}