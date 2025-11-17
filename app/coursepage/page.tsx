import Footer from '@/page_components/Footer'
import { ChevronsLeft, Circle, FullscreenIcon, VolumeIcon, PlayIcon } from 'lucide-react'

import { CheckCircle } from 'lucide-react'
import React from 'react'

export default function page() {
    return (
        <div className='flex flex-col gap-8'>
            <nav className='mt-4  w-13/14 mx-auto '>

                <button className=' cursor-pointer flex py-3 px-6 rounded-lg bg-[#665bca] text-white text-md flex-1'>  <span><ChevronsLeft /></span>
                    Back to Dashboard</button>
            </nav>

            <main className='flex gap-8  w-13/14 mx-auto '>

                <div className='w-8/12 flex flex-col gap-6'>
                    <div className='border p-6 rounded-xl'>
                        <h2 className='text-3xl font-semibold' >Python for Data Science </h2>
                        <p>Learn Python programming and data analysis with pandas and NumPy</p>

                        <div className='w-[100%] bg-gray-200 h-2 rounded-xl mt-2'>
                            <div className='w-xs bg-[#665bca] h-2 rounded-s-xl'></div>
                        </div>
                    </div>

                    <div className='border p-6 rounded-xl flex flex-col gap-6'>
                        <h3 className='text-3xl font-semibold' >Module 2 : Data Structures</h3>

                        <div>
                            {/* OUTER CONTAINER: Tailwind-styled Control Bar */}
                            <div className='w-full p-2 bg-black bg-opacity-70 text-white flex flex-col'>

                                {/* Top Row: Seek Bar (Semantic + Tailwind Structure) */}
                                <div className='flex items-center w-full mb-1 seek-bar-container'>
                                    {/* The semantic structure for the progress bar/buffer */}
                                    <div className='progress-bar-buffer'></div>

                                    {/* The seek slider using Tailwind classes */}
                                    <input
                                        type="range"
                                        name="seekBar"
                                        id="seekBar"
                                        className='w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer seek-slider'
                                    />
                                </div>

                                {/* Bottom Row: Control Buttons and Info (Semantic + Tailwind Structure) */}
                                <div className='flex items-center justify-between controls-bar'>

                                    {/* Left Controls: Play/Pause */}
                                    <div className='flex items-center space-x-3 left-controls'>
                                        <button id='playPauseBtn' className='p-1 hover:text-gray-300 transition-colors'>
                                            <PlayIcon />
                                        </button>
                                    </div>

                                    {/* Right Controls: Volume, Speed, Time, Fullscreen */}
                                    <div className='flex items-center space-x-3 right-controls'>

                                        {/* Volume Control */}
                                        <div className='flex items-center space-x-1 volume-control'>
                                            <button id='muteToggleBtn' className='p-1 hover:text-gray-300 transition-colors'>
                                                <VolumeIcon />
                                            </button>
                                            <input
                                                type="range"
                                                id="volumeSlider"
                                                className='w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer volume-slider'
                                            />
                                        </div>

                                        {/* Playback Speed */}
                                        <select
                                            name="playbackSpeed"
                                            id="playbackSpeedSelect"
                                            className='bg-transparent text-sm border-none focus:ring-0 focus:border-none cursor-pointer speed-select'
                                        >
                                            <option value="1" className='text-black'>1x</option>
                                            <option value="1.5" className='text-black'>1.5x</option>
                                            <option value="2" className='text-black'>2x</option>
                                        </select>

                                        {/* Time Display */}
                                        <span className="text-sm time-display">
                                            <span id="currentTime">0:00</span>
                                            /
                                            <span id="duration">5:00</span>
                                        </span>

                                        {/* Fullscreen Button */}
                                        <button id="fullscreenBtn" className='p-1 hover:text-gray-300 transition-colors fullscreen-btn'>
                                            <FullscreenIcon />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='flex justify-between mt-4 gap-8'>
                            <button className=' cursor-pointer   py-3 px-6 rounded-lg border-[#e9e9e9] bg-[#e9e9e9] text-[#000] border-2  text-md flex-1'>Previous Module</button>
                            <button className=' cursor-pointer   py-3 px-6 rounded-lg bg-[#665bca] text-white text-md flex-1'>Mark as Complete</button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-4/12 border p-6 rounded-xl">
                    <div className='flex justify-between '>
                        <h4 className='text-2xl font-semibold' >Course Modules</h4>
                        <span className='bg-green-100 text-green-700 text-sm rounded-lg p-2'>80% Complete</span></div>
                    <p>1 of 6 completed</p>

                    <div className='flex flex-col gap-2 mt-4'>
                        {/* Module 1: Completed */}
                        <button className=' cursor-pointer  flex  p-4 border-2 border-[#dfdfdf] rounded-xl'>
                            <div className='flex space-x-4 '>
                                {/* Ideally, use a filled circle icon like <CheckCircle /> */}
                                <CheckCircle className="text-green-600" />
                                <div className='text-start' >
                                    <h4 className=' text-md font-semibold'>Module 1</h4>
                                    <p className='text-xs text-gray-600'>Python Basics</p>
                                </div>
                            </div>
                        </button>


                        {/* Module 2: Active / Current */}
                        <button className=' cursor-pointer  flex  p-4 border-2 border-[#dfdfdf] rounded-xl bg-blue-100/50 border-l-4 border-blue-600'>
                            <div className='flex space-x-4 '>
                                <Circle className="text-gray-400" />
                                <div className='text-start' >
                                    <h4 className='text-md font-semibold'>Module 2</h4>
                                    <p className='text-xs text-gray-600'>Data Structures</p>
                                </div>
                            </div>
                        </button>

                        {/* Module 3: Not Started */}
                        <button className=' cursor-pointer  flex p-4  rounded-xl hover:bg-gray-100 border-2 border-[#dfdfdf]'>
                            <div className='flex space-x-4 '>
                                <Circle className="text-gray-400" />
                                <div className='text-start' >
                                    <h4 className='text-md font-semibold'>Module 3</h4>
                                    <p className='text-xs text-gray-600'>Numpy & Vectorization</p>
                                </div>
                            </div>
                        </button>

                        {/* Module 4: Not Started */}
                        <button className=' cursor-pointer  flex p-4 border-2 border-[#dfdfdf] rounded-xl hover:bg-gray-100'>
                            <div className='flex space-x-4 '>
                                <Circle className="text-gray-400" />
                                <div className='text-start' >
                                    <h4 className='text-md font-semibold'>Module 4</h4>
                                    <p className='text-xs text-gray-600'>Data Analysis with Pandas</p>
                                </div>
                            </div>
                        </button>

                        {/* Module 5: Not Started */}
                        <button className=' cursor-pointer  flex p-4 border-2 border-[#dfdfdf] rounded-xl hover:bg-gray-100'>
                            <div className='flex space-x-4 '>
                                <Circle className="text-gray-400" />
                                <div className='text-start' >
                                    <h4 className='text-md font-semibold'>Module 5</h4>
                                    <p className='text-xs text-gray-600'>Data Visualization (Matplotlib)</p>
                                </div>
                            </div>
                        </button>

                        {/* Module 6: Not Started */}
                        <button className=' cursor-pointer  flex p-4 border-2 border-[#dfdfdf] rounded-xl hover:bg-gray-100'>
                            <div className='flex space-x-4 '>
                                <Circle className="text-gray-400" />
                                <div className='text-start' >
                                    <h4 className='text-md font-semibold'>Module 6</h4>
                                    <p className='text-xs text-gray-600'>Basic Machine Learning</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

            </main>
            <Footer />
        </div>

    )
}