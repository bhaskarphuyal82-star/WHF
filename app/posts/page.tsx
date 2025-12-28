import Header from "@/components/Header";
import Footer from "@/components/Footer";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, ImageIcon, Search } from "lucide-react";

export const dynamic = 'force-dynamic';

async function getPosts() {
    await connectDB();
    const posts = await Post.find({ published: true }).sort({ publishedAt: -1 }).lean();
    return JSON.parse(JSON.stringify(posts));
}

export default async function PostsPage() {
    const posts = await getPosts();

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
                            हाम्रो ब्लग
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            ताजा समाचार र अपडेटहरू
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            हाम्रा गतिविधिहरू, आगामी कार्यक्रमहरू, र समुदायका कथाहरू बारे जानकारी लिनुहोस्।
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post: any) => (
                            <div key={post._id} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all duration-300 flex flex-col h-full">
                                <div className="aspect-video relative overflow-hidden bg-gray-900">
                                    {post.featuredImage ? (
                                        <Image
                                            src={post.featuredImage}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon className="w-12 h-12 text-gray-700" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-medium text-orange-400 border border-orange-500/20">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                                        <Calendar className="w-4 h-4 text-orange-500" />
                                        {formatDate(post.publishedAt || post.createdAt)}
                                    </div>

                                    <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-orange-400 transition-colors">
                                        {post.title}
                                    </h2>

                                    <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">
                                        {post.excerpt}
                                    </p>

                                    <Link
                                        href={post.slug ? `/posts/${post.slug}` : '#'}
                                        className="inline-flex items-center gap-2 text-white font-medium hover:text-orange-400 transition-colors mt-auto"
                                    >
                                        पूरा पढ्नुहोस् <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {posts.length === 0 && (
                        <div className="text-center py-20">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                                <Search className="w-8 h-8 text-gray-600" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">कुनै पोस्ट भेटिएन</h3>
                            <p className="text-gray-400">अपडेटका लागि पछि पुनः जाँच गर्नुहोस्।</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
