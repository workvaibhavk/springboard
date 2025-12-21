// app/learn/[id]/page.tsx
"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import VideoPlayer from '@/components/VideoPlayer'
import ModuleList from '@/components/ModuleList'
import { fetchCourseData, fetchModules, fetchProgress, markModuleComplete } from '@/lib/courseApi'
import DNavbar from '@/page_components/DNavbar'

export default function LearnPage() {
    const params = useParams();
    const courseId = params.id;
    const { user, isLoaded } = useUser();

    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [currentModule, setCurrentModule] = useState(null);
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [completedModules, setCompletedModules] = useState([]);
    const [loading, setLoading] = useState(true);

    // Video tracking states
    const [watchedPercentage, setWatchedPercentage] = useState(0);
    const [hasWatched90Percent, setHasWatched90Percent] = useState(false);

    useEffect(() => {
        if (isLoaded && user) {
            fetchLearningData();
        }
    }, [isLoaded, user, courseId]);

    const fetchLearningData = async () => {
        setLoading(true);

        try {
            const [courseData, modulesData, progressData] = await Promise.all([
                fetchCourseData(courseId),
                fetchModules(courseId),
                fetchProgress(courseId)
            ]);

            setCourse(courseData);
            setModules(modulesData);

            if (modulesData.length > 0) {
                setCurrentModule(modulesData[0]);
                setCurrentModuleIndex(0);
            }

            if (progressData.completedModules) {
                setCompletedModules(progressData.completedModules);
            }
        } catch (error) {
            console.error('Error fetching learning data:', error);
        } finally {
            setLoading(false);
        }
    };

    const goToPreviousModule = () => {
        if (currentModuleIndex > 0) {
            const prevIndex = currentModuleIndex - 1;
            setCurrentModule(modules[prevIndex]);
            setCurrentModuleIndex(prevIndex);
        }
    };

    const goToNextModule = () => {
        if (currentModuleIndex < modules.length - 1) {
            const nextIndex = currentModuleIndex + 1;
            setCurrentModule(modules[nextIndex]);
            setCurrentModuleIndex(nextIndex);
        }
    };

    const handleModuleSelect = (module, index) => {
        setCurrentModule(module);
        setCurrentModuleIndex(index);
    };

    const handleMarkComplete = async () => {
        if (!currentModule) return;

        try {
            await markModuleComplete(courseId, currentModule.id);

            if (!completedModules.includes(currentModule.id)) {
                setCompletedModules([...completedModules, currentModule.id]);
            }

            setTimeout(() => {
                if (currentModuleIndex < modules.length - 1) {
                    goToNextModule();
                } else {
                    alert('🎉 Congratulations! You completed all modules!');
                }
            }, 500);
        } catch (error) {
            console.error('Error marking complete:', error);
            alert(error.message || 'Failed to mark as complete');
        }
    };

    if (loading) {
        return <div className='flex justify-center items-center min-h-screen'>Loading...</div>;
    }

    return (
        <div className='flex flex-col gap-8 bg-gray-50'>
            <DNavbar />
            <main className='flex gap-8 w-13/14 mx-auto'>
                <div className='w-8/12 flex flex-col gap-6'>
                    {/* Course Header */}
                    <div className='bg-white border border-gray-200 p-6 rounded-xl shadow-sm'>
                        <h2 className='text-3xl font-bold text-gray-900 mb-2'>
                            {course?.title.split(':')[0] || 'Loading...'}
                        </h2>
                        <p className='text-gray-600 mb-4'>
                            {course?.description.slice(0, 85)}..</p>
                        <div className='w-[100%] bg-gray-200 h-2 rounded-xl mt-2'>
                            <div
                                className='bg-[#665bca] h-2 rounded-s-xl'
                                style={{
                                    width: `${(completedModules.length / modules.length) * 100}%`
                                }}
                            ></div>
                        </div>
                        <p className='mt-2' >{completedModules.length} of {modules.length} completed</p>

                    </div>

                    {/* Module Content */}
                    <div className='flex flex-col gap-6  bg-white border border-gray-200 p-6 rounded-xl shadow-sm
'>
                        <h3 className='text-3xl font-semibold'>
                            {currentModuleIndex + 1} : {currentModule?.title || 'Loading...'}
                        </h3>

                        <VideoPlayer
                            currentModule={currentModule}
                            onWatchedPercentageChange={setWatchedPercentage}
                            onHasWatched90Percent={setHasWatched90Percent}
                        />

                        {/* Navigation Buttons */}
                        <div className='flex justify-between mt-4 gap-4'>
                            <button
                                className='cursor-pointer py-3 px-6 rounded-lg border-[#e9e9e9] bg-[#e9e9e9] text-[#000] border-2 text-md flex-1 disabled:opacity-50 disabled:cursor-default'
                                onClick={goToPreviousModule}
                                disabled={currentModuleIndex === 0}
                            >
                                Previous Module
                            </button>

                            <button
                                onClick={handleMarkComplete}
                                disabled={!hasWatched90Percent || completedModules.includes(currentModule?.id)}
                                className='cursor-pointer py-3 px-6 rounded-lg border-[#e9e9e9] bg-[#e9e9e9] text-[#000] border-2 text-md flex-1 disabled:opacity-50 disabled:cursor-default'
                            >
                                {completedModules.includes(currentModule?.id)
                                    ? 'Completed'
                                    : hasWatched90Percent
                                        ? 'Mark as Complete'
                                        : `Watch ${90 - Math.floor(watchedPercentage)}% More to Complete`
                                }
                            </button>

                            <button
                                className='cursor-pointer py-3 px-6 rounded-lg bg-[#665bca] text-white text-md flex-1 disabled:opacity-50 disabled:cursor-default'
                                onClick={goToNextModule}
                                disabled={currentModuleIndex === modules.length - 1}
                            >
                                Next Module
                            </button>
                        </div>
                    </div>
                </div>

                {/* Module List Sidebar */}
                <ModuleList
                    modules={modules}
                    currentModule={currentModule}
                    completedModules={completedModules}
                    onModuleSelect={handleModuleSelect}
                />
            </main>
        </div>
    );
}