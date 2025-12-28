"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/ImageUpload";

export default function NewSliderPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        image: "",
        link: "",
        order: 0,
        active: true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/sliders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/admin/sliders");
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to create slider");
            }
        } catch (error) {
            console.error("Failed to create slider:", error);
            alert("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/sliders">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">New Slider</h1>
                    <p className="text-gray-400 text-sm">Create a new hero slider</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Main Content */}
                <div className="grid gap-6 p-6 bg-white/5 border border-white/10 rounded-xl">
                    <h2 className="text-lg font-semibold text-white mb-4">Content</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                                placeholder="Enter main heading"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Subtitle (Optional)</label>
                            <input
                                type="text"
                                value={formData.subtitle}
                                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                                placeholder="Enter subtitle or description"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Button Link (Optional)</label>
                            <input
                                type="text"
                                value={formData.link}
                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                                placeholder="/about"
                            />
                        </div>
                    </div>
                </div>

                {/* Image Upload */}
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                    <h2 className="text-lg font-semibold text-white mb-4">Background Image</h2>
                    <ImageUpload
                        onUploadComplete={(url) => setFormData({ ...formData, image: url })}
                        currentImage={formData.image}
                    />
                </div>

                {/* Settings */}
                <div className="grid md:grid-cols-2 gap-6 p-6 bg-white/5 border border-white/10 rounded-xl">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Display Order</label>
                        <input
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                        />
                        <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                    </div>

                    <div className="flex items-center gap-3 pt-8">
                        <input
                            type="checkbox"
                            id="active"
                            checked={formData.active}
                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                            className="w-5 h-5 rounded border-gray-600 text-orange-600 focus:ring-orange-500 bg-gray-700"
                        />
                        <label htmlFor="active" className="text-white font-medium cursor-pointer">
                            Active Status
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Link href="/admin/sliders">
                        <Button type="button" variant="ghost" className="text-gray-400 hover:text-white">
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={loading || !formData.image}
                        className="bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-500 hover:to-red-500 border-0"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Create Slider
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
