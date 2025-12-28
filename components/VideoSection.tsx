'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Video, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface VideoItem {
    _id: string;
    title: string;
    thumbnail?: string;
    videoUrl: string;
    description?: string;
}

interface VideoSectionProps {
    videos: VideoItem[];
}

// Helper function to extract YouTube video ID
function getYouTubeVideoId(url: string): string | null {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
}

// Helper function to get embed URL
function getEmbedUrl(url: string): string {
    // Check if it's a YouTube URL
    const youtubeId = getYouTubeVideoId(url);
    if (youtubeId) {
        return `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
    }

    // Check if it's a Vimeo URL
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    }

    // Return original URL for direct video files
    return url;
}

// Check if URL is embeddable (YouTube, Vimeo) or direct video
function isEmbeddable(url: string): boolean {
    return !!(getYouTubeVideoId(url) || url.match(/vimeo\.com\/(\d+)/));
}

// Helper function to get YouTube thumbnail URL
function getYouTubeThumbnail(url: string): string | null {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
        // maxresdefault is highest quality, falls back automatically if not available
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return null;
}

// Get the best available thumbnail for a video
function getVideoThumbnail(video: VideoItem): string | null {
    // If video has a custom thumbnail, use it
    if (video.thumbnail) {
        return video.thumbnail;
    }
    // Otherwise, try to get YouTube thumbnail
    return getYouTubeThumbnail(video.videoUrl);
}

export default function VideoSection({ videos }: VideoSectionProps) {
    const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

    const openVideoModal = (video: VideoItem) => {
        setSelectedVideo(video);
        document.body.style.overflow = 'hidden';
    };

    const closeVideoModal = () => {
        setSelectedVideo(null);
        document.body.style.overflow = 'auto';
    };

    return (
        <>
            <section className="relative py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <span className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-300 text-sm font-medium mb-4">
                                मिडिया लाइब्रेरी
                            </span>
                            <h2 className="text-3xl font-bold text-white">ताजा भिडियोहरू</h2>
                        </div>
                        <Link href="/videos" className="text-orange-400 hover:text-orange-300 flex items-center gap-2 transition-colors">
                            सबै हेर्नुहोस् <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {videos.map((video) => {
                            const thumbnailUrl = getVideoThumbnail(video);
                            return (
                                <div
                                    key={video._id}
                                    onClick={() => openVideoModal(video)}
                                    className="group relative rounded-2xl overflow-hidden aspect-video border border-white/10 hover:border-orange-500/50 transition-all duration-300 cursor-pointer"
                                >
                                    {thumbnailUrl ? (
                                        <Image
                                            src={thumbnailUrl}
                                            alt={video.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            unoptimized={thumbnailUrl.includes('youtube.com') || thumbnailUrl.includes('img.youtube.com')}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                            <Video className="w-12 h-12 text-gray-600" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-orange-500/90 flex items-center justify-center pl-1 group-hover:scale-110 transition-transform cursor-pointer shadow-lg shadow-orange-500/20">
                                            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                                        <h3 className="text-white font-bold text-lg line-clamp-1">{video.title}</h3>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Video Modal */}
            {selectedVideo && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                    onClick={closeVideoModal}
                >
                    <div
                        className="relative w-full max-w-5xl mx-4 aspect-video"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeVideoModal}
                            className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors z-10"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {/* Video Title */}
                        <div className="absolute -top-12 left-0 text-white text-lg font-semibold truncate max-w-[80%]">
                            {selectedVideo.title}
                        </div>

                        {/* Video Player */}
                        <div className="w-full h-full rounded-xl overflow-hidden border border-white/10 bg-black">
                            {isEmbeddable(selectedVideo.videoUrl) ? (
                                <iframe
                                    src={getEmbedUrl(selectedVideo.videoUrl)}
                                    title={selectedVideo.title}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <video
                                    src={selectedVideo.videoUrl}
                                    controls
                                    autoPlay
                                    className="w-full h-full object-contain"
                                >
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
