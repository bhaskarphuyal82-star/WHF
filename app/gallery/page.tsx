import Header from "@/components/Header";
import Footer from "@/components/Footer";
import connectDB from "@/lib/mongodb";
import Gallery from "@/models/Gallery";
import Link from "next/link";
import Image from "next/image";
import { ImageIcon, Search, Calendar, Image as PhotoIcon } from "lucide-react";

export const dynamic = 'force-dynamic';

async function getGalleries() {
    await connectDB();
    const galleries = await Gallery.find({ published: true }).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(galleries));
}

export default async function GalleryPage() {
    const galleries = await getGalleries();

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
                            हाम्रा सम्झनाहरू
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            फोटो ग्यालरी
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            हाम्रा कार्यक्रमहरू, गतिविधिहरू र सामुदायिक कार्यहरूका पलहरू अन्वेषण गर्नुहोस्।
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {galleries.map((gallery: any) => (
                            <Link
                                href={`/gallery/${gallery._id}`}
                                key={gallery._id}
                                className="group block bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all duration-300"
                            >
                                <div className="aspect-[4/3] relative overflow-hidden bg-gray-900">
                                    {gallery.coverImage || (gallery.images && gallery.images.length > 0 && gallery.images[0].url) ? (
                                        <Image
                                            src={gallery.coverImage || gallery.images[0].url}
                                            alt={gallery.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon className="w-12 h-12 text-gray-700" />
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent group-hover:from-black/95 transition-all duration-300 flex flex-col justify-end p-6">
                                        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            <div className="flex items-center gap-2 text-xs text-orange-400 mb-2 uppercase tracking-wider font-semibold">
                                                {gallery.category || 'Event'}
                                            </div>
                                            <h2 className="text-xl font-bold text-white mb-2 line-clamp-1">
                                                {gallery.title}
                                            </h2>

                                            <div className="flex items-center justify-between text-sm text-gray-400 mt-4 border-t border-white/10 pt-4">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(gallery.eventDate || gallery.createdAt)}
                                                </span>
                                                <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded">
                                                    <PhotoIcon className="w-3 h-3" />
                                                    {gallery.images?.length || 0} तस्बिरहरू
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {galleries.length === 0 && (
                        <div className="text-center py-20">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                                <Search className="w-8 h-8 text-gray-600" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">कुनै ग्यालरी भेटिएन</h3>
                            <p className="text-gray-400">नयाँ तस्बिरहरूको लागि पछि पुनः जाँच गर्नुहोस्।</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
