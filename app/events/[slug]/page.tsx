
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";
import { Calendar, MapPin, Clock, Users, Building2, Share2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

async function getEvent(slug: string) {
    await connectDB();
    const event = await Event.findOne({ slug: slug, published: true }).lean();
    if (!event) return null;
    return JSON.parse(JSON.stringify(event));
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ne-NP', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
};

const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const event = await getEvent(resolvedParams.slug);
    if (!event) return { title: "Event Not Found" };
    return {
        title: `${event.title} | World Hindu Federation Nepal`,
        description: event.description.substring(0, 160),
    };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const event = await getEvent(resolvedParams.slug);

    if (!event) {
        notFound();
    }

    const isUpcoming = new Date(event.startDate) > new Date();

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />

            {/* Event Hero - Uses featured image or fallback */}
            <div className="relative h-[60vh] min-h-[400px] w-full">
                <div className="absolute inset-0 bg-black/60 z-10" />
                {event.featuredImage ? (
                    <Image
                        src={event.featuredImage}
                        alt={event.title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-slate-900" />
                )}
                <div className="absolute bottom-0 left-0 w-full z-20 pb-12 px-4 bg-gradient-to-t from-black via-black/80 to-transparent pt-32">
                    <div className="max-w-7xl mx-auto">
                        <Link href="/events" className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            कार्यक्रमहरूमा फर्कनुहोस्
                        </Link>
                        <div className="flex gap-4 mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${isUpcoming ? 'bg-orange-600 text-white' : 'bg-gray-600 text-white'}`}>
                                {isUpcoming ? 'आगामी कार्यक्रम' : 'सम्पन्न कार्यक्रम'}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm">
                                {event.category}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                            {event.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-gray-200">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-orange-500" />
                                <span>{formatDate(event.startDate)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-orange-500" />
                                <span>{event.location}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Description */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6 border-b border-border pb-2">विवरण</h2>
                            <div
                                className="prose prose-lg dark:prose-invert max-w-none prose-orange"
                                dangerouslySetInnerHTML={{ __html: event.description }}
                            />
                        </div>

                        {/* Gallery */}
                        {event.images && event.images.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold mb-6 border-b border-border pb-2">तस्वीरहरु</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {event.images.map((img: string, index: number) => (
                                        <div key={index} className="aspect-square relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                            <Image
                                                src={img}
                                                alt={`Gallery ${index}`}
                                                fill
                                                className="object-cover hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Event Details Card */}
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm sticky top-24">
                            <h3 className="text-xl font-bold mb-6">कार्यक्रम विवरण</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                                        <Calendar className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground font-medium">मिति</p>
                                        <p className="font-semibold">{formatDate(event.startDate)}</p>
                                        <p className="text-sm font-semibold">{formatTime(event.startDate)}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                                        <MapPin className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground font-medium">स्थान</p>
                                        <p className="font-semibold">{event.location}</p>
                                        {event.venue && <p className="text-sm text-muted-foreground">{event.venue}</p>}
                                    </div>
                                </div>

                                {event.maxAttendees > 0 && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                                            <Users className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground font-medium">क्षमता</p>
                                            <p className="font-semibold">{event.maxAttendees} जना</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-8 border-t border-border">
                                <h4 className="font-medium mb-3">यो कार्यक्रम सेयर गर्नुहोस्</h4>
                                <div className="flex gap-2">
                                    <button className="p-2 rounded-lg bg-accent hover:bg-accent/80 transition-colors">
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                    {/* Add Social Share Links here if needed */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
