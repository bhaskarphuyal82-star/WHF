"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2, Save, Upload, User, PenTool, Globe, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface SiteSettings {
    siteName: string;
    siteLogo: string;
    chairmanName: string;
    chairmanTitle: string;
    chairmanSignature: string;
    regularMembershipFee: number;
    lifetimeMembershipFee: number;
    paymentInstructions: string;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<SiteSettings>({
        siteName: '',
        siteLogo: '',
        chairmanName: '',
        chairmanTitle: '',
        chairmanSignature: '',
        regularMembershipFee: 500,
        lifetimeMembershipFee: 2501,
        paymentInstructions: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setSuccessMessage("");
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                setSuccessMessage("Site Identity and settings updated successfully!");
                router.refresh();
                // Clear success message after 3 seconds
                setTimeout(() => setSuccessMessage(""), 3000);
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings. Please check your connection.');
        } finally {
            setSaving(false);
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
                setSettings(prev => ({ ...prev, chairmanSignature: uploadData.url }));
            }
        } catch (error) {
            console.error("Failed to upload image:", error);
            alert("Failed to upload signature");
        } finally {
            setUploading(false);
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
                setSettings(prev => ({ ...prev, siteLogo: uploadData.url }));
            }
        } catch (error) {
            console.error("Failed to upload image:", error);
            alert("Failed to upload logo");
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Globe className="w-8 h-8 text-orange-500" />
                        Platform Branding
                    </h1>
                    <p className="text-gray-400 mt-1">Configure how your site's name and logo appear to users.</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-lg shadow-orange-500/20 px-8 py-6 h-auto"
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-5 h-4 mr-2 animate-spin" />
                            Updating...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5 mr-2" />
                            <span className="text-lg font-bold">Apply Changes</span>
                        </>
                    )}
                </Button>
            </div>

            {successMessage && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="font-medium">{successMessage}</span>
                </div>
            )}

            <div className="grid gap-8">
                {/* Global Site Configuration */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[100px] -mr-32 -mt-32 rounded-full group-hover:bg-orange-500/10 transition-colors" />

                    <h2 className="text-xl font-semibold text-white mb-8 flex items-center gap-3">
                        <PenTool className="w-6 h-6 text-orange-500" />
                        Header Logo & Site Name
                    </h2>

                    <div className="grid gap-6 max-w-2xl">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">
                                Site Name
                            </label>
                            <Input
                                value={settings.siteName}
                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                className="bg-black/20 border-white/10 text-white"
                                placeholder="e.g. विश्व हिन्दु महासंघ नेपाल"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 block">
                                Site Logo
                            </label>
                            <div className="flex items-start gap-6">
                                <div className="relative w-32 h-32 bg-white rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden group">
                                    {settings.siteLogo ? (
                                        <div className="relative w-full h-full p-2">
                                            <Image
                                                src={settings.siteLogo}
                                                alt="Site Logo"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <PenTool className="w-8 h-8 text-gray-400" />
                                    )}

                                    <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Upload className="w-6 h-6 text-white mb-1" />
                                        <span className="text-xs text-white">Upload</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleLogoUpload}
                                            disabled={uploading}
                                        />
                                    </label>

                                    {uploading && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                                            <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 text-sm text-gray-400">
                                    <p>Upload a clean, high-resolution logo.</p>
                                    <p className="mt-1">Recommended format: PNG or WebP with transparent background.</p>
                                    <p>Recommended size: 256x256px or similar square ratio.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chairman Configuration */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-orange-500" />
                        Official Signature Configuration
                    </h2>

                    <div className="grid gap-6 max-w-2xl">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">
                                Authorized Person Name (Nepali preferred for Visiting Card)
                            </label>
                            <Input
                                value={settings.chairmanName}
                                onChange={(e) => setSettings({ ...settings, chairmanName: e.target.value })}
                                className="bg-black/20 border-white/10 text-white"
                                placeholder="e.g. डा. रामचन्द्र अधिकारी"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">
                                Title/Position
                            </label>
                            <Input
                                value={settings.chairmanTitle}
                                onChange={(e) => setSettings({ ...settings, chairmanTitle: e.target.value })}
                                className="bg-black/20 border-white/10 text-white"
                                placeholder="e.g. अध्यक्ष"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 block">
                                Digital Signature
                            </label>
                            <div className="flex items-start gap-6">
                                <div className="relative w-48 h-24 bg-white rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden group">
                                    {settings.chairmanSignature ? (
                                        <div className="relative w-full h-full p-2">
                                            <Image
                                                src={settings.chairmanSignature}
                                                alt="Signature"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <PenTool className="w-8 h-8 text-gray-400" />
                                    )}

                                    <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Upload className="w-6 h-6 text-white mb-1" />
                                        <span className="text-xs text-white">Upload PNG</span>
                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                        />
                                    </label>

                                    {uploading && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                                            <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 text-sm text-gray-400">
                                    <p>Upload a clean PNG signature.</p>
                                    <p className="mt-1">Recommended size: 200x100px.</p>
                                    <p>Background should be transparent.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Membership Fees Configuration */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[100px] -mr-32 -mt-32 rounded-full group-hover:bg-green-500/10 transition-colors" />
                    
                    <h2 className="text-xl font-semibold text-white mb-8 flex items-center gap-3">
                        <Save className="w-6 h-6 text-green-500" />
                        Membership Fees & Payment Instructions
                    </h2>

                    <div className="grid gap-6 max-w-4xl">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">
                                    Regular Membership Fee (Rs.)
                                </label>
                                <Input
                                    type="number"
                                    value={settings.regularMembershipFee}
                                    onChange={(e) => setSettings({ ...settings, regularMembershipFee: Number(e.target.value) })}
                                    className="bg-black/20 border-white/10 text-white"
                                    placeholder="500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">
                                    Lifetime Membership Fee (Rs.)
                                </label>
                                <Input
                                    type="number"
                                    value={settings.lifetimeMembershipFee}
                                    onChange={(e) => setSettings({ ...settings, lifetimeMembershipFee: Number(e.target.value) })}
                                    className="bg-black/20 border-white/10 text-white"
                                    placeholder="2501"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">
                                Payment Instructions (Bank details, QR Info, etc.)
                            </label>
                            <textarea
                                value={settings.paymentInstructions}
                                onChange={(e) => setSettings({ ...settings, paymentInstructions: e.target.value })}
                                className="w-full h-32 bg-black/20 border border-white/10 rounded-lg text-white p-4 focus:outline-none focus:border-orange-500/50"
                                placeholder="Enter payment instructions for users..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                These instructions will be shown to users during the registration process.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
