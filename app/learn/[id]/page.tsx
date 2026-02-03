// app/learn/[id]/page.tsx
"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import VideoPlayer from '@/components/VideoPlayer'
import ModuleList from '@/components/ModuleList'
import { fetchCourseData, fetchModules, fetchProgress, markModuleComplete } from '@/lib/courseApi'
import DNavbar from '@/page_components/DNavbar'
import type { Course, Module, ProgressData } from '@/types/learning'
import Link from 'next/link'
import { Download } from 'lucide-react'
// import { Link } from 'lucide-react'

export default function LearnPage() {
    const params = useParams<{ id: string }>();
    const courseId = params.id;
    const { user, isLoaded } = useUser();

    const [course, setCourse] = useState<Course | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [currentModule, setCurrentModule] = useState<Module | null>(null);
    const [currentModuleIndex, setCurrentModuleIndex] = useState<number>(0);
    const [completedModules, setCompletedModules] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Video tracking states
    const [watchedPercentage, setWatchedPercentage] = useState<number>(0);
    const [hasWatched90Percent, setHasWatched90Percent] = useState<boolean>(false);

    // FIX 2: Derive isCompleted from actual data instead of a one-time flag.
    // This way it's true on page load if the user already finished everything.
    const isCompleted = modules.length > 0 && completedModules.length >= modules.length;

    useEffect(() => {
        if (isLoaded && user && courseId) {
            fetchLearningData();
        }
    }, [isLoaded, user, courseId]);

    const fetchLearningData = async (): Promise<void> => {
        if (!courseId) return;

        setLoading(true);

        try {
            const [courseData, modulesData, progressData] = await Promise.all([
                fetchCourseData(courseId) as Promise<Course>,
                fetchModules(courseId) as Promise<Module[]>,
                fetchProgress(courseId) as Promise<ProgressData>
            ]);

            setCourse(courseData);
            setModules(modulesData);

            if (modulesData.length > 0) {
                setCurrentModule(modulesData[0]);
                setCurrentModuleIndex(0);
            }

            if (progressData.completedModules) {
                // FIX 1 (part A): Deduplicate whatever the DB returns,
                // so even if duplicates already exist they won't inflate the count.
                const unique = [...new Set(progressData.completedModules)];
                setCompletedModules(unique);
            }
        } catch (error) {
            console.error('Error fetching learning data:', error);
        } finally {
            setLoading(false);
        }
    };

    const goToPreviousModule = (): void => {
        if (currentModuleIndex > 0) {
            const prevIndex = currentModuleIndex - 1;
            setCurrentModule(modules[prevIndex]);
            setCurrentModuleIndex(prevIndex);
            setHasWatched90Percent(false);
        }
    };

    const goToNextModule = (): void => {
        if (currentModuleIndex < modules.length - 1) {
            const nextIndex = currentModuleIndex + 1;
            setCurrentModule(modules[nextIndex]);
            setCurrentModuleIndex(nextIndex);
            setHasWatched90Percent(false);
        }
    };

    const handleModuleSelect = (module: Module, index: number): void => {
        setCurrentModule(module);
        setCurrentModuleIndex(index);
        setHasWatched90Percent(false);
    };

    const handleMarkComplete = async (): Promise<void> => {
        if (!currentModule || !courseId) return;

        // FIX 1 (part B): If already completed, skip the API call entirely.
        // This is the main reason duplicates were being written to the DB.
        if (completedModules.includes(currentModule.id)) {
            goToNextModule();
            return;
        }

        try {
            await markModuleComplete(courseId, currentModule.id);

            setCompletedModules(prev => [...prev, currentModule.id]);

            setTimeout(() => {
                if (currentModuleIndex < modules.length - 1) {
                    goToNextModule();
                } else {
                    alert('🎉 Congratulations! You completed all modules!');
                    // No need to setIsCompleted — it's now derived automatically.
                }
            }, 500);
        } catch (error) {
            console.error('Error marking complete:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to mark as complete';
            alert(errorMessage);
        }
    };

    const calculateProgress = (): number => {
        if (modules.length === 0) return 0;
        return (completedModules.length / modules.length) * 100;
    };

    const isLastModule = (): boolean => {
        return currentModuleIndex === modules.length - 1;
    };

    const isFirstModule = (): boolean => {
        return currentModuleIndex === 0;
    };

    const isModuleCompleted = (): boolean => {
        return currentModule ? completedModules.includes(currentModule.id) : false;
    };

    if (loading) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <div className='text-lg text-gray-600'>Loading...</div>
            </div>
        );
    }

    if (!course || modules.length === 0) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <div className='text-lg text-gray-600'>No course data available</div>
            </div>
        );
    }

    return (
        <div className='flex flex-col gap-4 bg-gray-50'>
            <DNavbar />
            <main className='flex flex-col md:flex-row gap-8 w-13/14 mx-auto'>
                <div className='w-8/12 flex-col-reverse flex md:flex-col gap-6'>
                    {/* Course Header */}
                    <div className='bg-white border border-gray-200 p-6 rounded-xl shadow-sm mb-6'>
                        <h2 className='text-3xl font-bold text-gray-900 mb-2'>
                            {course.title.split(':')[0]}
                        </h2>
                        <p className='text-gray-600 mb-4'>
                            {course.description.slice(0, 85)}..
                        </p>
                        <div className='w-[100%] bg-gray-200 h-2 rounded-xl mt-2'>
                            <div
                                className='bg-[#665bca] h-2 rounded-s-xl transition-all duration-300'
                                style={{
                                    width: `${calculateProgress()}%`
                                }}
                            ></div>
                        </div>
                        <p className='mt-2 text-sm text-gray-600'>
                            {completedModules.length} of {modules.length} completed
                        </p>
                    </div>

                    {/* Module Content */}
                    <div className='flex flex-col gap-6 bg-white border border-gray-200 p-6 rounded-xl shadow-sm'>
                        <h3 className='text-xl md:text-3xl font-semibold'>
                            {currentModuleIndex + 1}: {currentModule?.title || 'Loading...'}
                        </h3>

                        <VideoPlayer
                            currentModule={currentModule}
                            onWatchedPercentageChange={setWatchedPercentage}
                            onHasWatched90Percent={setHasWatched90Percent}
                        />

                        {/* Navigation Buttons */}
                        <div className='flex justify-between mt-4 gap-4'>
                            <button
                                className='cursor-pointer md:py-3 md:px-6 px-2 py-4 rounded-lg border-[#e9e9e9] bg-[#e9e9e9] text-[#000] border-2 text-sm md:text-md flex-1 disabled:opacity-50 disabled:cursor-default transition-opacity'
                                onClick={goToPreviousModule}
                                disabled={isFirstModule()}
                                type='button'
                            >
                                Previous Module
                            </button>

                            {isModuleCompleted() ? (
                                // Don't render Next Module at all on the last module — 
                                // otherwise it sits there disabled and crowds out Get Certificate
                                !isLastModule() && (
                                    <button
                                        className='cursor-pointer md:py-3 md:px-6 px-2 py-4  rounded-lg bg-[#665bca] text-white text-sm md:text-md flex-1 transition-opacity'
                                        onClick={goToNextModule}
                                        type='button'
                                    >
                                        Next Module
                                    </button>
                                )
                            ) : (
                                <button
                                    onClick={handleMarkComplete}
                                    disabled={!hasWatched90Percent}
                                    className='cursor-pointer text-sm md:text-md md:py-3 md:px-6 px-2 py-4  rounded-lg border-[#e9e9e9] bg-[#665bca] text-white border-2 flex-1 disabled:opacity-50 disabled:cursor-default transition-opacity'
                                    type='button'
                                >
                                    {hasWatched90Percent
                                        ? 'Mark as Complete'
                                        : 'Watch More to Complete'
                                    }
                                </button>
                            )}



                            {isCompleted && (
                                <Link href={`/certificate/${courseId}`}>
                                    <button
                                        className='cursor-pointer md:py-3 md:px-6 px-2 py-4 rounded-lg bg-green-500 text-white text-sm md:text-md'
                                        type='button'
                                    >
                                        <Download className="mr-2 inline-block" />  Get Certificate
                                    </button>
                                </Link>
                            )} </div>
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