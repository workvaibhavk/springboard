'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { CheckIcon } from 'lucide-react';
import type {
    DifficultyLevel,
    CourseCategory,
    CourseTag,
    AddCourseApiRequest,
    AddCourseApiResponse
} from '@/types/course';

const TAGS_OPTIONS: readonly CourseTag[] = [
    'WebDev', 'FullStack', 'Frontend', 'Backend', 'JavaScript',
    'Algorithms', 'DataStructures', 'Python', 'Java', 'CSharp',
    'Ruby', 'PHP', 'GoLang', 'Rust', 'C++',
    'DevOps', 'AWS', 'Azure', 'Docker', 'Kubernetes',
    'MachineLearning', 'AI', 'DataScience', 'BigData', 'CloudComputing',
    'ReactJS', 'NodeJS', 'MongoDB', 'MERN', 'HTMLCSS',
    'Tailwind', 'Bootstrap', 'Django', 'Flutter',
    'AndroidDev', 'AppDev', 'DSA', 'Coding', 'GitGitHub',
    'API', 'StockMarket', 'Investing', 'Trading', 'Intraday',
    'Options', 'MutualFund', 'SIP', 'MoneyTips', 'PassiveIncome',
    'Finance', 'Nifty', 'BankNifty',
    'GraphicDesign', 'UIUX', 'Figma', 'Canva', 'Photoshop',
    'Illustrator', 'LogoDesign', 'WebDesign', 'UIDesign', 'Motion',
    'AfterEffects', 'Business', 'Startup', 'Entrepreneur', 'SideHustle',
    'Ecommerce', 'Dropship', 'DigitalMkt', 'MakeMoney', 'Freelance',
    'BusinessIdea', 'Sales', 'Marketing', 'CyberSecurity', 'Eth Hacking', 'ComputerNetwork',
    'Linux', 'IoT', 'Robotics', 'EmbeddedSystems',
    'VideoEditing', 'FilmMaking', 'Storytelling',
    'Communication',
    'Governance', 'Civics', 'Law'
] as const;

const DIFFICULTY_LEVELS: readonly DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'] as const;

const CATEGORIES: readonly CourseCategory[] = [
    'Programming',
    'Web/App dev',
    'Cyber Security',
    'Computer Science',
    'Tech',
    'Creativity',
    'General skills'
] as const;

export default function AddCoursePage() {
    const [playlistId, setPlaylistId] = useState<string>('');
    const [maxVideos, setMaxVideos] = useState<string>('');
    const [level, setLevel] = useState<DifficultyLevel>('beginner');
    const [category, setCategory] = useState<CourseCategory>('Programming');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [selectedTags, setSelectedTags] = useState<CourseTag[]>([]);

    const toggleTag = (tag: CourseTag): void => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(item => item !== tag)
                : [...prev, tag]
        );
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const requestBody: AddCourseApiRequest = {
                playlistId: playlistId.trim(),
                maxVideos: maxVideos ? parseInt(maxVideos, 10) : null,
                level,
                category,
                tags: selectedTags
            };

            const response = await fetch('/api/add-course', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data: AddCourseApiResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add course');
            }

            setSuccess(data.message);
            setPlaylistId('');
            setMaxVideos('');
            setLevel('beginner');
            setCategory('Programming');
            setSelectedTags([]);
            window.scrollTo(0, 0);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handlePlaylistIdChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setPlaylistId(e.target.value);
    };

    const handleMaxVideosChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setMaxVideos(e.target.value);
    };

    const handleLevelChange = (e: ChangeEvent<HTMLSelectElement>): void => {
        setLevel(e.target.value as DifficultyLevel);
    };

    const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>): void => {
        setCategory(e.target.value as CourseCategory);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">
                        Add New Course
                    </h1>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                            <p className="text-sm text-green-600">{success}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="playlistId"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Playlist ID <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="playlistId"
                                value={playlistId}
                                onChange={handlePlaylistIdChange}
                                placeholder="PLxxxxxxxxxxxxxxxxxxxxxx"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#665bca] focus:border-[#665bca] outline-none transition"
                                required
                                disabled={loading}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Paste the YouTube playlist ID directly
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="maxVideos"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Max Videos (Optional)
                            </label>
                            <input
                                type="number"
                                id="maxVideos"
                                value={maxVideos}
                                onChange={handleMaxVideosChange}
                                placeholder="Leave empty for all videos"
                                min="1"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#665bca] focus:border-[#665bca] outline-none transition"
                                disabled={loading}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Default: All videos in the playlist
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="level"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Difficulty Level
                            </label>
                            <select
                                id="level"
                                value={level}
                                onChange={handleLevelChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#665bca] focus:border-[#665bca] outline-none transition-all bg-white"
                            >
                                {DIFFICULTY_LEVELS.map((diffLevel) => (
                                    <option key={diffLevel} value={diffLevel}>
                                        {diffLevel.charAt(0).toUpperCase() + diffLevel.slice(1)}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1 text-xs text-gray-500">
                                Select the course difficulty level.
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="category"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Category
                            </label>
                            <select
                                id="category"
                                value={category}
                                onChange={handleCategoryChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#665bca] focus:border-[#665bca] outline-none transition-all bg-white"
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1 text-xs text-gray-500">
                                Select the course category.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tags
                            </label>
                            <div className="flex flex-row flex-wrap content-center items-center gap-1 text-sm">
                                {TAGS_OPTIONS.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        type="button"
                                        className={`
                      py-[8px] px-[16px] border-[#ddd] rounded-[20px] cursor-pointer inline-flex items-center gap-[6px] 
                      ${selectedTags.includes(tag)
                                                ? 'bg-[#7b34ff] border-[#4caf50] text-[#ffffff]'
                                                : 'bg-[#e6cefa]'
                                            }
                    `}
                                    >
                                        {selectedTags.includes(tag) && <CheckIcon className="w-4 h-4" />}
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#665bca] hover:bg-[#5548b8] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-md transition duration-200 flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Adding Course...
                                </>
                            ) : (
                                'Add Course'
                            )}
                        </button>
                    </form>
                    <button
                        type="button"
                        disabled={loading}
                        className="w-full mt-3 bg-white hover:bg-gray-50 disabled:opacity-50 text-gray-700 font-medium py-2.5 px-4 rounded-md border border-gray-300 transition duration-200"
                    >
                        Cancel
                    </button>
                </div>

                <div className="mt-6 bg-[#fff] border border-[#665bca] rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-[#665bca] mb-2">
                        How to find Playlist ID:
                    </h3>
                    <ol className="text-xs text-[#665bca] space-y-1 list-decimal list-inside">
                        <li>Go to the YouTube playlist</li>
                        <li>Copy the URL from your browser</li>
                        <li>The ID is after &quot;list=&quot; in the URL</li>
                        <li>Example: youtube.com/playlist?list=<strong>PLxxxxxx</strong></li>
                    </ol>
                </div>
            </div>
        </div>
    );
}