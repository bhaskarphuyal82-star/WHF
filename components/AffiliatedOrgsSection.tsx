"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Building2, Globe, MapPin } from "lucide-react";

interface AffiliatedOrg {
    _id: string;
    name: string;
    description?: string;
    logo?: string;
    website?: string;
    location?: string;
    type: string;
}

interface AffiliatedOrgsSectionProps {
    orgs: AffiliatedOrg[];
}

export default function AffiliatedOrgsSection({ orgs }: AffiliatedOrgsSectionProps) {
    if (!orgs || orgs.length === 0) return null;

    // Group by type if needed, or just show all in a nice grid
    // For now, let's show all in a premium grid layout

    return (
        <section className="relative py-24 bg-white/5 border-y border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-300 text-sm font-medium mb-6"
                    >
                        हाम्रो संजाल
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl font-bold text-white mb-4"
                    >
                        सम्बद्ध संगठनहरू
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 max-w-2xl mx-auto"
                    >
                        विश्व हिन्दु महासंघसँग सहकार्य गर्ने राष्ट्रिय तथा अन्तर्राष्ट्रिय संस्थाहरू
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orgs.map((org, index) => (
                        <motion.div
                            key={org._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-black/40 border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 transition-all duration-300"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-300">
                                    {org.logo ? (
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={org.logo}
                                                alt={org.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <Building2 className="w-8 h-8 text-gray-500" />
                                    )}
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${org.type === 'International'
                                        ? 'bg-purple-500/10 border-purple-500/20 text-purple-300'
                                        : org.type === 'National'
                                            ? 'bg-blue-500/10 border-blue-500/20 text-blue-300'
                                            : 'bg-green-500/10 border-green-500/20 text-green-300'
                                    }`}>
                                    {org.type}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                                {org.name}
                            </h3>

                            {org.description && (
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                    {org.description}
                                </p>
                            )}

                            <div className="space-y-2 mt-auto pt-4 border-t border-white/5">
                                {org.location && (
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <MapPin className="w-4 h-4 text-orange-500/50" />
                                        <span>{org.location}</span>
                                    </div>
                                )}
                                {org.website && (
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-orange-500/50" />
                                        <a
                                            href={org.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-orange-400 hover:text-orange-300 hover:underline"
                                        >
                                            Visit Website
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Hover Gradient Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
