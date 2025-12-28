"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2, Save, Upload, User, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SiteSettings {
    chairmanName: string;
    chairmanTitle: string;
    chairmanSignature: string;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<SiteSettings>({
        chairmanName: '',
        chairmanTitle: '',
        chairmanSignature: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

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
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                alert('Settings saved successfully!');
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings');
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">General Settings</h1>
                <p className="text-gray-400 mt-1">Manage global site configuration</p>
            </div>

            <div className="grid gap-6">
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

                        <div className="pt-4">
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-orange-600 hover:bg-orange-700 text-white"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
