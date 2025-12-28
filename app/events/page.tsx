
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = 'force-dynamic';

async function getEvents() {
    await connectDB();
    const events = await Event.find({ published: true })
        .sort({ startDate: -1 }) // Show latest first? Or Upcoming first? Usually absolute date sort.
        .lean();
    return JSON.parse(JSON.stringify(events));
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ne-NP', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
};

export default async function EventsPage() {
    const events = await getEvents();

    // Separate upcoming and past
    const now = new Date();
    const upcoming = events.filter((e: any) => new Date(e.startDate) >= now);
    const past = events.filter((e: any) => new Date(e.startDate) < now);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />

            <PageHero
                title="गतिविधिहरू"
                subtitle="हाम्रा विभिन्न धार्मिक तथा सामाजिक गतिविधिहरूको विवरण।"
                image="/events-bg.jpg"
            />

            <section className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Upcoming Events */}
                    {upcoming.length > 0 && (
                        <div className="mb-20">
                            <h2 className="text-3xl font-bold mb-8 border-l-4 border-orange-500 pl-4">आगामी कार्यक्रमहरू</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {upcoming.map((event: any) => (
                                    <EventCard key={event._id} event={event} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Past Events */}
                    {past.length > 0 && (
                        <div>
                            <h2 className="text-3xl font-bold mb-8 border-l-4 border-gray-500 pl-4">सम्पन्न कार्यक्रमहरू</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {past.map((event: any) => (
                                    <EventCard key={event._id} event={event} />
                                ))}
                            </div>
                        </div>
                    )}

                    {events.length === 0 && (
                        <div className="text-center py-20 bg-accent/50 rounded-2xl border border-dashed border-border">
                            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-muted-foreground">कुनै कार्यक्रम भेटिएन</h3>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}

function EventCard({ event }: { event: any }) {
    return (
        <div className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:border-orange-500/30 transition-all duration-300">
            <div className="aspect-video relative overflow-hidden bg-muted">
                {event.featuredImage ? (
                    <Image
                        src={event.featuredImage}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Calendar className="w-12 h-12 text-muted-foreground" />
                    </div>
                )}
                <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${new Date(event.startDate) > new Date() ? 'bg-orange-600 text-white' : 'bg-gray-600 text-white'
                        }`}>
                        {new Date(event.startDate) > new Date() ? 'Upcoming' : 'Completed'}
                    </span>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-orange-500 mb-3">
                    <Calendar className="w-4 h-4" />
                    {formatDate(event.startDate)}
                </div>
                <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {event.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                </div>
                <Link
                    href={`/events/${event.slug}`}
                    className="inline-flex items-center text-orange-600 font-medium hover:text-orange-500 transition-colors"
                >
                    थप विवरण <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    )
}
