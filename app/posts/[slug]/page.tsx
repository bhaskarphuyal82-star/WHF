import Header from "@/components/Header";
import Footer from "@/components/Footer";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";

export const dynamic = 'force-dynamic';

async function getPost(slug: string) {
    await connectDB();
    const post = await Post.findOne({ slug, published: true }).populate('author', 'name').lean();
    if (!post) return null;
    return JSON.parse(JSON.stringify(post));
}

export default async function PostDetailPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
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
                {/* Hero Section */}
                <div className="relative h-[60vh] min-h-[400px] w-full">
                    <div className="absolute inset-0">
                        {post.featuredImage ? (
                            <Image
                                src={post.featuredImage}
                                alt={post.title}
                                fill
                                className="object-cover opacity-50"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black opacity-50" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    </div>

                    <div className="relative h-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
                        <Link
                            href="/posts"
                            className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6 w-fit"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to News
                        </Link>

                        <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                            <span className="px-3 py-1 bg-orange-500 text-white rounded-full font-medium">
                                {post.category}
                            </span>
                            <span className="flex items-center gap-1 text-gray-300">
                                <Calendar className="w-4 h-4" />
                                {formatDate(post.publishedAt || post.createdAt)}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            {post.title}
                        </h1>

                        {post.author && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                    <User className="w-5 h-5 text-gray-300" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">{post.author.name || 'Admin'}</p>
                                    <p className="text-xs text-gray-400">Author</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div
                        className="prose prose-invert prose-lg max-w-none prose-orange hover:prose-a:text-orange-400"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-white/10">
                            <div className="flex items-center gap-2 flex-wrap">
                                <Tag className="w-4 h-4 text-orange-500" />
                                <span className="text-sm text-gray-400 mr-2">Tags:</span>
                                {post.tags.map((tag: string) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm text-gray-300 transition-colors"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </article>
            </main>

            <Footer />
        </div>
    );
}
