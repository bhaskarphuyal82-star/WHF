"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { User, MapPin, Calendar, LogOut, Camera, Loader2, Settings, Home, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { nepalProvinces } from "@/lib/nepalAddress";
import VisitingCardModal from "@/components/admin/VisitingCardModal";

interface MemberData {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    image?: string;
    address?: {
        province: string;
        district: string;
        municipality: string;
        ward: string;
        tole?: string;
    };
    membershipStatus: string;
    membershipDate?: string;
    createdAt: string;
}

// ... existing interfaces

export default function MemberDashboard() {
    const router = useRouter();
    const [member, setMember] = useState<MemberData | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);

    useEffect(() => {
        fetchMemberData();
    }, []);

    const fetchMemberData = async () => {
        try {
            const response = await fetch("/api/members/me");
            if (response.ok) {
                const data = await response.json();
                setMember(data);
            } else {
                router.push("/login");
            }
        } catch (error) {
            console.error("Failed to fetch member data:", error);
            router.push("/login");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const uploadResponse = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const uploadData = await uploadResponse.json();

            if (uploadData.url) {
                // Update profile with new image
                const updateResponse = await fetch("/api/members/me", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: uploadData.url }),
                });

                if (updateResponse.ok) {
                    setMember(prev => prev ? { ...prev, image: uploadData.url } : null);
                }
            }
        } catch (error) {
            console.error("Failed to upload image:", error);
            alert("फोटो अपलोड गर्न असफल भयो");
        } finally {
            setUploading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch("/api/members/logout", { method: "POST" });
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const getProvinceName = (provinceId: string) => {
        const province = nepalProvinces.find(p => p.id === provinceId);
        return province?.name || provinceId;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("ne-NP", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
            </div>
        );
    }

    if (!member) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
            {/* Header ... */}
            <header className="bg-black/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-2 text-white font-bold">
                            <Home className="w-5 h-5" />
                            गृहपृष्ठ
                        </Link>
                        <h1 className="text-lg font-semibold text-white">सदस्य ड्यासबोर्ड</h1>
                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="text-gray-400 hover:text-white"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            लगआउट
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-12">
                {/* Profile Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    {/* Cover ... */}
                    <div className="h-32 bg-gradient-to-r from-orange-600 to-red-600" />

                    {/* Profile Photo */}
                    <div className="px-8 -mt-16 pb-8">
                        <div className="relative inline-block">
                            {/* ... existing image logic ... */}
                            <div className="w-32 h-32 rounded-full border-4 border-black bg-gray-800 overflow-hidden">
                                {member.image ? (
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-500">
                                        <span className="text-4xl font-bold text-white">
                                            {member.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            {/* Upload Button */}
                            <label className="absolute bottom-0 right-0 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors border-2 border-black">
                                {uploading ? (
                                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                                ) : (
                                    <Camera className="w-5 h-5 text-white" />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                            </label>
                        </div>

                        {/* Member Info */}
                        <div className="mt-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-white">{member.name}</h2>
                                <p className="text-gray-400">{member.email}</p>
                                {member.phone && (
                                    <p className="text-gray-500">{member.phone}</p>
                                )}
                            </div>

                            {/* Generate Card Button (Only if Approved) */}
                            {member.membershipStatus === 'Approved' && (
                                <Button
                                    onClick={() => setShowCardModal(true)}
                                    className="bg-orange-600 hover:bg-orange-700 text-white"
                                >
                                    <CreditCard className="w-4 h-4 mr-2" />
                                    परिचय पत्र डाउनलोड
                                </Button>
                            )}
                        </div>

                        {/* Status Badge */}
                        <div className="mt-4 flex items-center gap-4">
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${member.membershipStatus === 'Approved'
                                ? 'bg-green-500/20 text-green-400'
                                : member.membershipStatus === 'Rejected'
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                {member.membershipStatus === 'Approved' ? 'सक्रिय सदस्य' :
                                    member.membershipStatus === 'Rejected' ? 'अस्वीकृत' : 'पेन्डिङ'}
                            </span>
                            {member.membershipDate && (
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    सदस्यता मिति: {formatDate(member.membershipDate)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Address Card */}
                {member.address && (
                    <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-orange-500" />
                            ठेगाना
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">प्रदेश</p>
                                <p className="text-white">{getProvinceName(member.address.province)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">जिल्ला</p>
                                <p className="text-white">{member.address.district}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">नगरपालिका/गाउँपालिका</p>
                                <p className="text-white">{member.address.municipality}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">वडा नं.</p>
                                <p className="text-white">{member.address.ward}</p>
                            </div>
                            {member.address.tole && (
                                <div className="md:col-span-2">
                                    <p className="text-sm text-gray-500">टोल</p>
                                    <p className="text-white">{member.address.tole}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Quick Links */}
                <div className="mt-6 grid md:grid-cols-2 gap-4">
                    <Link
                        href="/"
                        className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-orange-500/50 transition-colors group"
                    >
                        <Home className="w-8 h-8 text-orange-500 mb-3" />
                        <h3 className="text-white font-medium group-hover:text-orange-400 transition-colors">गृहपृष्ठ हेर्नुहोस्</h3>
                        <p className="text-sm text-gray-500 mt-1">मुख्य पृष्ठमा जानुहोस्</p>
                    </Link>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 opacity-50">
                        <Settings className="w-8 h-8 text-gray-500 mb-3" />
                        <h3 className="text-gray-400 font-medium">सेटिङ्स</h3>
                        <p className="text-sm text-gray-600 mt-1">चाँडै आउँदैछ</p>
                    </div>
                </div>
            </main>

            {/* Visiting Card Modal */}
            {showCardModal && member && (
                <VisitingCardModal
                    isOpen={showCardModal}
                    onClose={() => setShowCardModal(false)}
                    data={{
                        ...member,
                        position: 'General Member' // Default position for members
                    }}
                />
            )}
        </div>
    );
}
