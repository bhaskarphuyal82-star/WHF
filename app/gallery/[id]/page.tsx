import Header from "@/components/Header";
import Footer from "@/components/Footer";
import connectDB from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Search } from "lucide-react";

export const dynamic = 'force-dynamic';

async function getGallery(id: string) {
    await connectDB();
    try {
        const gallery = await Gallery.findById(id).lean();
        if (!gallery || !gallery.published) return null;
        return JSON.parse(JSON.stringify(gallery));
    } catch (error) {
        return null;
    }
}

export default async function GalleryDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const gallery = await getGallery(id);

    if (!gallery) {
        notFound();
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
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
                    <Link
                        href="/gallery"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Galleries
                    </Link>

                    <div className="mb-12">
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-sm font-medium">
                                {gallery.category || 'Event'}
                            </span>
                            <span className="flex items-center gap-2 text-gray-400">
                                <Calendar className="w-4 h-4" />
                                {formatDate(gallery.eventDate || gallery.createdAt)}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            {gallery.title}
                        </h1>
                        {gallery.description && (
                            <p className="text-gray-400 text-lg max-w-3xl">
                                {gallery.description}
                            </p>
                        )}
                    </div>

                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {gallery.images && gallery.images.length > 0 ? (
                            gallery.images.map((image: any, index: number) => (
                                <div key={index} className="break-inside-avoid relative group rounded-xl overflow-hidden bg-gray-900 border border-white/10 hover:border-orange-500/30 transition-colors">
                                    <Image
                                        src={image.url}
                                        alt={image.caption || `Gallery image ${index + 1}`}
                                        width={800} // Use appropriate width
                                        height={600} // Aspect ratio handling? "columns" usually works better with intrinsic height
                                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                                        style={{ height: 'auto' }} // Ensure natural height
                                    />
                                    {image.caption && (
                                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <p className="text-white text-sm font-medium">{image.caption}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-gray-400">No images in this gallery yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
