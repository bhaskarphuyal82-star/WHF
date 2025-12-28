'use client';

import Image from 'next/image';
import { MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import { nepalProvinces } from '@/lib/nepalAddress';

interface MemberItem {
    _id: string;
    name: string;
    image?: string;
    address?: {
        province: string;
        district: string;
        municipality?: string;
    };
    membershipDate?: string;
}

interface MembersSectionProps {
    members: MemberItem[];
}

export default function MembersSection({ members }: MembersSectionProps) {
    if (!members || members.length === 0) return null;

    const getProvinceName = (provinceId: string) => {
        const province = nepalProvinces.find(p => p.id === provinceId);
        return province?.name || '';
    };

    return (
        <section className="relative py-24 bg-gradient-to-b from-transparent via-orange-950/10 to-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-300 text-sm font-medium mb-4">
                            <Users className="w-4 h-4" />
                            हाम्रा सदस्यहरू
                        </span>
                        <h2 className="text-3xl font-bold text-white">दर्ता भएका सदस्यहरू</h2>
                    </div>
                    <Link
                        href="/register"
                        className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-red-500 transition-all"
                    >
                        सदस्य बन्नुहोस्
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {members.slice(0, 12).map((member) => (
                        <div
                            key={member._id}
                            className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-orange-500/30 transition-all duration-300"
                        >
                            {/* Avatar */}
                            <div className="aspect-square relative bg-gradient-to-br from-orange-500/20 to-red-500/20">
                                {member.image ? (
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-2xl font-bold">
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <h3 className="text-white font-medium text-sm line-clamp-1 group-hover:text-orange-400 transition-colors">
                                    {member.name}
                                </h3>
                                {member.address && (
                                    <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {member.address.district}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile CTA */}
                <div className="mt-8 text-center md:hidden">
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-red-500 transition-all"
                    >
                        सदस्य बन्नुहोस्
                    </Link>
                </div>
            </div>
        </section>
    );
}
