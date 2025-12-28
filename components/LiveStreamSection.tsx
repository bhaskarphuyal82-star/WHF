'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Radio, X, MapPin, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface LiveStreamItem {
    _id: string;
    title: string;
    description?: string;
    streamUrl: string;
    location: string;
    thumbnail?: string;
    status: 'Live' | 'Scheduled' | 'Ended';
    scheduledAt?: string;
}

interface LiveStreamSectionProps {
    liveStreams: LiveStreamItem[];
}

// Helper function to extract YouTube video ID
function getYouTubeVideoId(url: string): string | null {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
}

// Helper function to get embed URL for live streams
function getEmbedUrl(url: string): string {
    // Check if it's a YouTube URL
    const youtubeId = getYouTubeVideoId(url);
    if (youtubeId) {
        return `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
    }

    // Check if it's a Facebook Live URL
    if (url.includes('facebook.com')) {
        return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&autoplay=1`;
    }

    // Return original URL
    return url;
}

// Get YouTube thumbnail
function getYouTubeThumbnail(url: string): string | null {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return null;
}

// Get thumbnail for a stream
function getStreamThumbnail(stream: LiveStreamItem): string | null {
    if (stream.thumbnail) {
        return stream.thumbnail;
    }
    return getYouTubeThumbnail(stream.streamUrl);
}

export default function LiveStreamSection({ liveStreams }: LiveStreamSectionProps) {
    const [selectedStream, setSelectedStream] = useState<LiveStreamItem | null>(null);

    // Separate live and scheduled streams
    const liveNow = liveStreams.filter(s => s.status === 'Live');
    const scheduled = liveStreams.filter(s => s.status === 'Scheduled');

    const openStreamModal = (stream: LiveStreamItem) => {
        setSelectedStream(stream);
        document.body.style.overflow = 'hidden';
    };

    const closeStreamModal = () => {
        setSelectedStream(null);
        document.body.style.overflow = 'auto';
    };

    const formatScheduledDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ne-NP', {
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (liveStreams.length === 0) return null;

    return (
        <>
            <section className="relative py-24 bg-gradient-to-b from-red-950/20 via-transparent to-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 text-sm font-bold mb-4">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                लाइभ प्रसारण
                            </span>
                            <h2 className="text-3xl font-bold text-white">धार्मिक स्थलबाट सिधा प्रसारण</h2>
                        </div>
                    </div>

                    {/* Live Now Section */}
                    {liveNow.length > 0 && (
                        <div className="mb-12">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {liveNow.map((stream) => {
                                    const thumbnailUrl = getStreamThumbnail(stream);
                                    return (
                                        <div
                                            key={stream._id}
                                            onClick={() => openStreamModal(stream)}
                                            className="group relative rounded-2xl overflow-hidden border-2 border-red-500/50 hover:border-red-500 transition-all duration-300 cursor-pointer shadow-lg shadow-red-500/20"
                                        >
                                            {/* Live Badge */}
                                            <div className="absolute top-4 left-4 z-10">
                                                <span className="px-3 py-1 text-sm font-bold bg-red-600 text-white rounded-full flex items-center gap-2 shadow-lg animate-pulse">
                                                    <span className="w-2 h-2 bg-white rounded-full" />
                                                    LIVE
                                                </span>
                                            </div>

                                            {/* Thumbnail */}
                                            <div className="aspect-video relative bg-gray-900">
                                                {thumbnailUrl ? (
                                                    <Image
                                                        src={thumbnailUrl}
                                                        alt={stream.title}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                        unoptimized={thumbnailUrl.includes('youtube.com')}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Radio className="w-16 h-16 text-red-500 animate-pulse" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                    <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-red-500/50">
                                                        <Radio className="w-10 h-10 text-white" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="p-5 bg-gradient-to-b from-gray-900 to-black">
                                                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                                                    {stream.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                                    <MapPin className="w-4 h-4 text-red-500" />
                                                    {stream.location}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Scheduled Section */}
                    {scheduled.length > 0 && (
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-orange-500" />
                                आगामी प्रसारण
                            </h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {scheduled.slice(0, 4).map((stream) => {
                                    const thumbnailUrl = getStreamThumbnail(stream);
                                    return (
                                        <div
                                            key={stream._id}
                                            className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-orange-500/30 transition-colors"
                                        >
                                            {/* Thumbnail */}
                                            <div className="aspect-video relative bg-gray-900">
                                                {thumbnailUrl ? (
                                                    <Image
                                                        src={thumbnailUrl}
                                                        alt={stream.title}
                                                        fill
                                                        className="object-cover opacity-70"
                                                        unoptimized={thumbnailUrl.includes('youtube.com')}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Radio className="w-10 h-10 text-gray-600" />
                                                    </div>
                                                )}
                                                <div className="absolute top-2 left-2">
                                                    <span className="px-2 py-1 text-xs font-medium bg-blue-600/80 text-white rounded">
                                                        Scheduled
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="p-4">
                                                <h4 className="text-white font-medium mb-2 line-clamp-2 text-sm">
                                                    {stream.title}
                                                </h4>
                                                <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {stream.location}
                                                </div>
                                                {stream.scheduledAt && (
                                                    <div className="flex items-center gap-2 text-xs text-orange-400">
                                                        <Calendar className="w-3 h-3" />
                                                        {formatScheduledDate(stream.scheduledAt)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Stream Modal */}
            {selectedStream && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
                    onClick={closeStreamModal}
                >
                    <div
                        className="relative w-full max-w-5xl mx-4 aspect-video"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeStreamModal}
                            className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors z-10"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {/* Stream Title with Live Badge */}
                        <div className="absolute -top-12 left-0 flex items-center gap-3">
                            <span className="px-2 py-1 text-xs font-bold bg-red-600 text-white rounded flex items-center gap-1">
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                LIVE
                            </span>
                            <span className="text-white text-lg font-semibold truncate max-w-[60%]">
                                {selectedStream.title}
                            </span>
                        </div>

                        {/* Video Player */}
                        <div className="w-full h-full rounded-xl overflow-hidden border border-red-500/30 bg-black">
                            <iframe
                                src={getEmbedUrl(selectedStream.streamUrl)}
                                title={selectedStream.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                allowFullScreen
                            />
                        </div>

                        {/* Location */}
                        <div className="absolute -bottom-10 left-0 flex items-center gap-2 text-gray-400">
                            <MapPin className="w-4 h-4 text-red-500" />
                            {selectedStream.location}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
