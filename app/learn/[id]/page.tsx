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
        <div className='flex flex-col gap-4 bg-gray-50 min-h-screen'>
            <DNavbar />

            {/* Main Content Container - Responsive width constraints */}
            <main className='flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 w-full px-4 sm:px-6 lg:px-8 xl:w-11/12 2xl:w-10/12 mx-auto pb-8'>

                {/* Left Column - Video and Course Info */}
                <div className='w-full lg:w-8/12 xl:w-2/3 flex flex-col gap-4 sm:gap-6'>

                    {/* Course Header */}
                    <div className='bg-white border border-gray-200 p-4 sm:p-6 rounded-xl shadow-sm'>
                        <h2 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2'>
                            {course.title.split(':')[0]}
                        </h2>
                        <p className='text-sm sm:text-base text-gray-600 mb-4'>
                            {course.description.slice(0, 85)}..
                        </p>

                        {/* Progress Bar */}
                        <div className='w-full bg-gray-200 h-2 rounded-xl mt-2'>
                            <div
                                className='bg-[#665bca] h-2 rounded-s-xl transition-all duration-300'
                                style={{
                                    width: `${calculateProgress()}%`
                                }}
                            ></div>
                        </div>
                        <p className='mt-2 text-xs sm:text-sm text-gray-600'>
                            {completedModules.length} of {modules.length} completed ({Math.round(calculateProgress())}%)
                        </p>
                    </div>

                    {/* Module Content */}
                    <div className='flex flex-col gap-4 sm:gap-6 bg-white border border-gray-200 p-4 sm:p-6 rounded-xl shadow-sm'>
                        <h3 className='text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900 leading-tight'>
                            Module {currentModuleIndex + 1}: {currentModule?.title || 'Loading...'}
                        </h3>

                        <VideoPlayer
                            currentModule={currentModule}
                            onWatchedPercentageChange={setWatchedPercentage}
                            onHasWatched90Percent={setHasWatched90Percent}
                        />

                        {/* Navigation Buttons - Responsive Layout */}
                        <div className='flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-4'>
                            {/* Previous Button */}
                            <button
                                className='cursor-pointer py-3 px-4 sm:px-6 lg:px-8 rounded-lg border-2 border-[#e9e9e9] bg-[#e9e9e9] text-[#000] text-sm sm:text-base font-medium flex-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-gray-200 active:scale-95'
                                onClick={goToPreviousModule}
                                disabled={isFirstModule()}
                                type='button'
                            >
                                Previous Module
                            </button>

                            {/* Complete/Next Button */}
                            {isModuleCompleted() ? (
                                !isLastModule() && (
                                    <button
                                        className='cursor-pointer py-3 px-4 sm:px-6 lg:px-8 rounded-lg bg-[#665bca] text-white text-sm sm:text-base font-medium flex-1 transition-all hover:bg-[#5449b0] active:scale-95'
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
                                    className='cursor-pointer py-3 px-4 sm:px-6 lg:px-8 rounded-lg bg-[#665bca] text-white text-sm sm:text-base font-medium flex-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-[#5449b0] active:scale-95'
                                    type='button'
                                >
                                    {hasWatched90Percent
                                        ? 'Mark as Complete'
                                        : 'Watch More to Complete'
                                    }
                                </button>
                            )}

                            {/* Certificate Button - Full width on mobile when shown */}
                            {isCompleted && (
                                <Link href={`/certificate/${courseId}`} className='sm:flex-1'>
                                    <button
                                        className='w-full cursor-pointer py-3 px-4 sm:px-6 lg:px-8 rounded-lg bg-green-500 text-white text-sm sm:text-base font-medium transition-all hover:bg-green-600 active:scale-95 flex items-center justify-center gap-2'
                                        type='button'
                                    >
                                        <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                                        Get Certificate
                                    </button>
                                </Link>
                            )}
                        </div>

                        {/* Video Progress Indicator - Mobile friendly */}
                        {/* {!isModuleCompleted() && (
                            <div className='mt-2 text-xs sm:text-sm text-gray-500 text-center'>
                                {hasWatched90Percent
                                    ? '✓ You can now mark this module as complete'
                                    : `Watch ${Math.max(0, 90 - watchedPercentage)}% more to unlock completion`
                                }
                            </div>
                        )} */}
                    </div>
                </div>

                {/* Right Column - Module List Sidebar */}
                <div className='w-full lg:w-4/12 xl:w-1/3'>
                    <ModuleList
                        modules={modules}
                        currentModule={currentModule}
                        completedModules={completedModules}
                        onModuleSelect={handleModuleSelect}
                    />
                </div>
            </main>
        </div>
    );
}