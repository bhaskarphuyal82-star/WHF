import Header from "@/components/Header";
import Footer from "@/components/Footer";
import connectDB from "@/lib/mongodb";
import Video from "@/models/Video";
import Link from "next/link";
import Image from "next/image";
import { Video as VideoIcon, Play, Search, Calendar } from "lucide-react";

export const dynamic = 'force-dynamic';

async function getVideos() {
    await connectDB();
    const videos = await Video.find({ published: true }).sort({ publishedAt: -1 }).lean();
    return JSON.parse(JSON.stringify(videos));
}

export default async function VideosPage() {
    const videos = await getVideos();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-300 text-sm font-medium mb-6">
                            मिडिया लाइब्रेरी
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            भिडियो ग्यालरी
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            हाम्रा नवीनतम वृत्तचित्रहरू, कार्यक्रमका झलकहरू, र अन्तर्वार्ताहरू हेर्नुहोस्।
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {videos.map((video: any) => (
                            <div key={video._id} className="group flex flex-col h-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all duration-300">
                                <a
                                    href={video.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative aspect-video block overflow-hidden bg-gray-900"
                                >
                                    {video.thumbnail ? (
                                        <Image
                                            src={video.thumbnail}
                                            alt={video.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <VideoIcon className="w-12 h-12 text-gray-700" />
                                        </div>
                                    )}

                                    {/* Play Button Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-orange-600/90 text-white flex items-center justify-center pl-1 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/30 backdrop-blur-sm">
                                            <Play className="w-8 h-8 fill-current" />
                                        </div>
                                    </div>

                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-medium text-white border border-white/10">
                                            {video.category}
                                        </span>
                                    </div>

                                    {video.duration && (
                                        <div className="absolute bottom-4 right-4 bg-black/80 px-2 py-1 rounded text-xs font-medium text-white">
                                            {video.duration}
                                        </div>
                                    )}
                                </a>

                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                                        <Calendar className="w-4 h-4 text-orange-500" />
                                        {formatDate(video.publishedAt || video.createdAt)}
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors">
                                        <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">
                                            {video.title}
                                        </a>
                                    </h3>

                                    {video.description && (
                                        <p className="text-gray-400 text-sm line-clamp-2 mt-auto">
                                            {video.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {videos.length === 0 && (
                        <div className="text-center py-20">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                                <Search className="w-8 h-8 text-gray-600" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">कुनै भिडियो भेटिएन</h3>
                            <p className="text-gray-400">नयाँ सामग्रीको लागि पछि पुनः जाँच गर्नुहोस्।</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
