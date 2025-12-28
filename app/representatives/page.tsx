import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Mail, Phone, Facebook, Linkedin, Instagram } from "lucide-react";
import connectDB from "@/lib/mongodb";
import Representative from "@/models/Representative";
import Image from "next/image";
import Link from "next/link";

export const dynamic = 'force-dynamic';

async function getData() {
    await connectDB();

    const representatives = await Representative.find()
        .sort({ order: 1 })
        .lean();

    return {
        representatives: JSON.parse(JSON.stringify(representatives)),
    };
}

export default async function RepresentativesPage() {
    const { representatives } = await getData();

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 border-b border-white/10">
                <div className="absolute inset-0 bg-gradient-to-b from-orange-950/20 to-transparent" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center">
                        <span className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-300 text-sm font-medium mb-6">
                            हाम्रो टोली
                        </span>
                        <h1 className="text-5xl font-bold text-white mb-6">
                            नेतृत्व र प्रतिनिधिहरू
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            विश्व हिन्दु महासंघ नेपालको अभियानको नेतृत्व गर्ने समर्पित व्यक्तिहरू
                        </p>
                    </div>
                </div>
            </section>

            {/* Representatives Grid */}
            <section className="relative py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {representatives && representatives.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {representatives.map((rep: any) => (
                                <div
                                    key={rep._id}
                                    className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 hover:bg-white/10 transition-all duration-300"
                                >
                                    {/* Image */}
                                    <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-orange-500/20 group-hover:border-orange-500/50 transition-colors duration-300">
                                        {rep.image ? (
                                            <Image
                                                src={rep.image}
                                                alt={rep.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                                <Users className="w-16 h-16 text-gray-600" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">
                                            {rep.name}
                                        </h3>
                                        <p className="text-orange-500/80 text-sm font-medium mb-4">
                                            {rep.position}
                                        </p>

                                        {/* Bio */}
                                        {rep.bio && (
                                            <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                                                {rep.bio}
                                            </p>
                                        )}

                                        {/* Contact Info */}
                                        <div className="space-y-2 mb-4">
                                            {rep.email && (
                                                <a
                                                    href={`mailto:${rep.email}`}
                                                    className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors"
                                                >
                                                    <Mail className="w-4 h-4" />
                                                    {rep.email}
                                                </a>
                                            )}
                                            {rep.phone && (
                                                <a
                                                    href={`tel:${rep.phone}`}
                                                    className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors"
                                                >
                                                    <Phone className="w-4 h-4" />
                                                    {rep.phone}
                                                </a>
                                            )}
                                        </div>

                                        {/* Social Links */}
                                        {rep.social && (rep.social.facebook || rep.social.linkedin || rep.social.instagram) && (
                                            <div className="flex items-center justify-center gap-3">
                                                {rep.social.facebook && (
                                                    <a
                                                        href={rep.social.facebook}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600/20 hover:border-blue-500/50 transition-all duration-300"
                                                    >
                                                        <Facebook className="w-4 h-4 text-gray-400 hover:text-blue-400" />
                                                    </a>
                                                )}
                                                {rep.social.linkedin && (
                                                    <a
                                                        href={rep.social.linkedin}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-700/20 hover:border-blue-600/50 transition-all duration-300"
                                                    >
                                                        <Linkedin className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                                                    </a>
                                                )}
                                                {rep.social.instagram && (
                                                    <a
                                                        href={rep.social.instagram}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-pink-600/20 hover:border-pink-500/50 transition-all duration-300"
                                                    >
                                                        <Instagram className="w-4 h-4 text-gray-400 hover:text-pink-400" />
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24">
                            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                <Users className="w-12 h-12 text-gray-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">
                                कुनै प्रतिनिधि भेटिएन
                            </h3>
                            <p className="text-gray-400">
                                कृपया पछि फेरि जाँच गर्नुहोस्।
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Back to Home */}
            <section className="pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500/10 border border-orange-500/30 text-orange-400 font-semibold rounded-lg hover:bg-orange-500/20 transition-all duration-300"
                    >
                        मुख्य पृष्ठमा फर्किनुहोस्
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
