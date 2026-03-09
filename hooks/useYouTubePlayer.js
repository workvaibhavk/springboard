// hooks/useYouTubePlayer.js
"use client"

import { useEffect, useState, useCallback, useRef } from 'react'

export function useYouTubePlayer(videoId, shouldInitialize = false) {
    const [player, setPlayer] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(100);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [watchedPercentage, setWatchedPercentage] = useState(0);
    const [hasWatched90Percent, setHasWatched90Percent] = useState(false);
    const [playerLoading, setPlayerLoading] = useState(true)

    const trackingIntervalRef = useRef(null);

    // Load YouTube IFrame API
    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }
    }, []);



    // Initialize YouTube Player
    useEffect(() => {
        if (!videoId || !window.YT || !shouldInitialize) {
            return;
        }

        // Cleanup existing player
        if (player) {
            try {
                player.destroy();
            } catch (error) {
                console.error('Error destroying player:', error);
            }
            setPlayer(null);
        }

        const initPlayer = () => {
            const container = document.getElementById('youtube-player');
            if (!container) {
                console.error('youtube-player container not found');
                return;
            }

            container.innerHTML = '';

            const newPlayer = new window.YT.Player('youtube-player', {
                videoId: videoId,
                playerVars: {
                    controls: 0,
                    modestbranding: 0,
                    rel: 0,
                    fs: 0,
                    showinfo: 0,
                    iv_load_policy: 3,
                    disablekb: 1,
                    autohide: 1,
                    playsinline: 1,
                    cc_load_policy: 0,
                    autoplay: 1,
                },
                events: {
                    onReady: onPlayerReady,
                    onStateChange: onPlayerStateChange
                },
            });

            setPlayer(newPlayer);
        };

        const timeoutId = setTimeout(() => {
            if (window.YT.Player) {
                initPlayer();
            } else {
                window.onYouTubeIframeAPIReady = initPlayer;
            }
        }, 100);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [videoId, shouldInitialize]);

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


    const onPlayerReady = (event) => {
        const videoDuration = event.target.getDuration();
        const videoVolume = event.target.getVolume();
        setDuration(videoDuration);
        setVolume(videoVolume);
        setPlayerLoading(false)
    };

    const onPlayerStateChange = (event) => {
        if (event.data === 1) {
            setIsPlaying(true);
            startTimeTracking(event.target);
        } else {
            setIsPlaying(false);
            stopTimeTracking();
        }
    };

    const startTimeTracking = (playerInstance) => {
        const activePlayer = playerInstance || player;

        if (!activePlayer || typeof activePlayer.getCurrentTime !== 'function') {
            console.error('No valid player instance available');
            return;
        }

        if (trackingIntervalRef.current) {
            clearInterval(trackingIntervalRef.current);
        }

        const interval = setInterval(() => {
            if (!activePlayer || typeof activePlayer.getCurrentTime !== 'function') {
                return;
            }

            try {
                const current = activePlayer.getCurrentTime();
                const total = activePlayer.getDuration();

                setCurrentTime(current);
                setDuration(total);

                const percentage = (current / total) * 100;
                setWatchedPercentage(percentage);

                if (percentage >= 90) {
                    setHasWatched90Percent(true);
                }
            } catch (error) {
                console.error('Error in tracking interval:', error);
            }
        }, 1000);

        trackingIntervalRef.current = interval;
    };

    const stopTimeTracking = () => {
        if (trackingIntervalRef.current) {
            clearInterval(trackingIntervalRef.current);
            trackingIntervalRef.current = null;
        }
    };

    const togglePlayPause = useCallback(() => {
        if (!player) return;

        if (isPlaying) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    }, [player, isPlaying]);

    const handleSeek = useCallback((event) => {
        if (!player) return;

        const newTime = parseFloat(event.target.value);
        const current = player.getCurrentTime();

        if (newTime < current) {
            player.seekTo(newTime, true);
        } else {
            console.log('⏭️ Please watch the video. Fast-forwarding is disabled.');
            // player.seekTo(newTime, true);
        }
    }, [player]);

    const handleVolumeChange = useCallback((event) => {
        if (!player) return;

        const newVolume = parseInt(event.target.value);
        player.setVolume(newVolume);
        setVolume(newVolume);
    }, [player]);

    const handleSpeedChange = useCallback((event) => {
        if (!player) return;

        const newRate = parseFloat(event.target.value);
        player.setPlaybackRate(newRate);
        setPlaybackRate(newRate);
    }, [player]);

    const toggleFullscreen = useCallback(() => {
        const playerElement = document.getElementById('player-container');

        if (!document.fullscreenElement) {
            playerElement?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }, []);

    const resetPlayer = useCallback(() => {
        setHasWatched90Percent(false);
        setWatchedPercentage(0);
        setCurrentTime(0);
        setIsPlaying(false);
        setPlayerLoading(true);
    }, []);

    useEffect(() => {
        resetPlayer();
    }, [videoId, resetPlayer])




    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (trackingIntervalRef.current) {
                clearInterval(trackingIntervalRef.current);
            }

            if (player) {
                try {
                    if (typeof player.destroy === 'function') {
                        player.destroy();
                    }
                } catch (error) {
                    console.error('Error destroying player:', error);
                }
            }
        };
    }, []);

    return {
        player,
        isPlaying,
        currentTime,
        duration,
        volume,
        playbackRate,
        watchedPercentage,
        hasWatched90Percent,
        togglePlayPause,
        handleSeek,
        handleVolumeChange,
        handleSpeedChange,
        toggleFullscreen,
        resetPlayer,
        playerLoading
    };
}

// y