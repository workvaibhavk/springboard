// components/VideoPlayer.jsx
"use client"

import { useEffect, useState } from 'react'
import { FullscreenIcon, VolumeIcon, PlayIcon, Pause } from 'lucide-react'
import Image from 'next/image'
import { useYouTubePlayer } from '@/hooks/useYouTubePlayer'

export default function VideoPlayer({
    currentModule,
    onWatchedPercentageChange,
    onHasWatched90Percent
}) {
    const [showPlayer, setShowPlayer] = useState(false);

    const {
        player,
        isPlaying,
        currentTime,
        duration,
        volume,
        playbackRate,
        watchedPercentage,
        hasWatched90Percent,
        playerLoading,
        togglePlayPause: playerTogglePlayPause,
        handleSeek,
        handleVolumeChange,
        handleSpeedChange,
        toggleFullscreen,
        initializePlayer,
        resetPlayer
    } = useYouTubePlayer(currentModule?.video_id, showPlayer);

    // Notify parent of watched percentage changes
    useEffect(() => {
        if (onWatchedPercentageChange) {
            onWatchedPercentageChange(watchedPercentage);
        }
    }, [watchedPercentage, onWatchedPercentageChange]);

    // Notify parent when 90% threshold is reached
    useEffect(() => {
        if (hasWatched90Percent && onHasWatched90Percent) {
            onHasWatched90Percent(true);
        }
    }, [hasWatched90Percent, onHasWatched90Percent]);

    // Reset player when module changes
    useEffect(() => {
        setShowPlayer(false);
        resetPlayer();
    }, [currentModule?.id]);

    const togglePlayPause = () => {
        if (!showPlayer) {
            setShowPlayer(true);
            return;
        }
        playerTogglePlayPause();
    };

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!player) return;

            switch (e.key) {
                case ' ':
                case 'p':
                    e.preventDefault();
                    togglePlayPause()
                    break;

                case 'f':
                    e.preventDefault();
                    toggleFullscreen()
                    break;

                case 'm':
                    e.preventDefault();
                    if (volume > 0) {
                        player.setVolume(0)
                        setVolume(0)
                    }
                    else {
                        player.setVolume(100)
                        setVolume(100)
                    }
                    break;

            }
        }

        window.addEventListener('keydown', handleKeyPress)

        return () => {
            window.removeEventListener('keydown', handleKeyPress)

        }

    }, [player, volume, isPlaying]);

    const getThumbnailUrl = () => {
        if (currentModule?.thumbnail && currentModule.thumbnail.trim() !== '') {
            return currentModule.thumbnail;
        }
        if (currentModule?.video_id) {
            return `https://img.youtube.com/vi/${currentModule.video_id}/maxresdefault.jpg`;
        }
        return null;
    };

    return (
        <div id="player-container" className="group relative w-full aspect-video bg-black overflow-hidden rounded-xl cursor-default">
            {/* YOUTUBE PLAYER CONTAINER - Always present in DOM */}
            {playerLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
            )}
            <div
                id="youtube-player"
                className="w-full h-full"
                style={{
                    display: showPlayer ? 'block' : 'none',
                    pointerEvents: showPlayer ? 'none' : 'auto'
                }}
            ></div>

            {/* THUMBNAIL OVERLAY - Shows when player is not initialized */}
            <div
                className="absolute inset-0 z-30 transition-opacity duration-300"
                style={{
                    opacity: showPlayer ? 0 : 1,
                    pointerEvents: showPlayer ? 'none' : 'auto'
                }}
            >
                {getThumbnailUrl() && (
                    <>
                        <Image
                            src={getThumbnailUrl()}
                            alt={currentModule?.title || 'Video thumbnail'}
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Play button overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                            <button
                                onClick={togglePlayPause}
                                className="w-20 h-20 flex items-center justify-center bg-gray-600 hover:bg-gray-700 rounded-full transition-all transform hover:scale-110"
                            >
                                <PlayIcon size={40} fill="white" className="text-white ml-1" />
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* OVERLAY (Shows on hover when player is active) */}
            <div
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent transition-opacity duration-300 flex flex-col justify-end p-4 z-20"
                style={{
                    opacity: 0,
                    pointerEvents: showPlayer ? 'auto' : 'none'
                }}
                onMouseEnter={(e) => showPlayer && (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => showPlayer && (e.currentTarget.style.opacity = '0')}
            >
                {/* SEEK BAR */}
                <div className="relative flex items-center w-full mb-3 pointer-events-auto">
                    <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white hover:h-2 transition-all"
                    />
                </div>

                {/* CONTROLS ROW */}
                <div className="flex items-center justify-between w-full pointer-events-auto">
                    {/* Left Section */}
                    <div className="flex items-center space-x-5">
                        <button
                            onClick={togglePlayPause}
                            className="text-white hover:text-gray-300 transition-colors cursor-pointer outline-none">
                            {isPlaying ? <Pause size={28} fill="currentColor" /> : <PlayIcon size={28} fill="currentColor" />}
                        </button>

                        {/* Volume Group */}
                        <div className="group/volume flex items-center space-x-2">
                            <button className="text-white hover:text-gray-300 cursor-pointer">
                                <VolumeIcon size={22} />
                            </button>
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={volume}
                                onChange={handleVolumeChange}
                                className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white"
                            />
                        </div>

                        <span className="text-white text-sm font-medium tracking-tight">
                            {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}
                            <span className="text-white/50 mx-1">/</span>
                            {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}
                        </span>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center space-x-5">
                        <div className="relative">
                            <select
                                value={playbackRate}
                                onChange={handleSpeedChange}
                                className="bg-transparent text-white text-sm font-bold border-none focus:ring-0 cursor-pointer hover:text-gray-300 appearance-none text-center"
                            >
                                <option value="0.5" className="text-black">0.5x</option>
                                <option value="1" className="text-black">1x</option>
                                <option value="1.5" className="text-black">1.5x</option>
                                <option value="2" className="text-black">2x</option>
                            </select>
                        </div>

                        <button
                            onClick={toggleFullscreen}
                            className="text-white hover:text-gray-300 transition-colors cursor-pointer">
                            <FullscreenIcon size={22} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}