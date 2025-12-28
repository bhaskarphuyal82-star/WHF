"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUpload from "@/components/admin/ImageUpload";

export default function NewLiveStreamPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        streamUrl: '',
        location: '',
        thumbnail: '',
        status: 'Scheduled' as 'Live' | 'Scheduled' | 'Ended',
        scheduledAt: '',
        isActive: true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/livestreams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt) : undefined,
                }),
            });

            if (response.ok) {
                router.push('/admin/livestreams');
            } else {
                alert('Failed to create live stream');
            }
        } catch (error) {
            console.error('Error creating live stream:', error);
            alert('Failed to create live stream');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="text-gray-400 hover:text-white"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-white">Add Live Stream</h1>
                    <p className="text-gray-400 mt-1">Stream from religious places</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            placeholder="Enter stream title (e.g., पशुपतिनाथ मन्दिर लाइभ)"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="streamUrl">Stream URL * (YouTube Live, Facebook Live, etc.)</Label>
                        <Input
                            id="streamUrl"
                            value={formData.streamUrl}
                            onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                            required
                            placeholder="https://www.youtube.com/watch?v=... or Facebook Live URL"
                        />
                        <p className="text-xs text-gray-500">
                            Paste the YouTube Live, Facebook Live, or other streaming embed URL
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            required
                            placeholder="e.g., पशुपतिनाथ मन्दिर, काठमाडौं"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white min-h-[100px]"
                            placeholder="Enter stream description"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white"
                            >
                                <option value="Scheduled">Scheduled</option>
                                <option value="Live">Live (Broadcasting Now)</option>
                                <option value="Ended">Ended</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="scheduledAt">Scheduled Date/Time</Label>
                            <Input
                                id="scheduledAt"
                                type="datetime-local"
                                value={formData.scheduledAt}
                                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <ImageUpload
                            label="Thumbnail (Optional - will auto-fetch from YouTube if not provided)"
                            value={formData.thumbnail}
                            onChange={(url) => setFormData({ ...formData, thumbnail: url as string })}
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isActive"
                            checked={formData.isActive}
                            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
                        />
                        <Label htmlFor="isActive" className="cursor-pointer">
                            Active (show on website)
                        </Label>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="ghost" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500"
                    >
                        {loading ? 'Creating...' : (
                            <>
                                <Radio className="w-4 h-4 mr-2" />
                                Create Live Stream
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
