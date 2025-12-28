"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X, Upload, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const CATEGORIES = [
    "Festival",
    "Event",
    "Community",
    "Religious",
    "Cultural",
    "Meeting",
    "Other"
];

export default function NewGalleryPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        images: [] as string[],
        published: false,
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const newImages: string[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append("file", files[i]);

                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();
                if (data.url) {
                    newImages.push(data.url);
                }
            }

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...newImages]
            }));
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload images");
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.images.length === 0) {
            alert("Please upload at least one image");
            return;
        }

        setLoading(true);

        try {
            const galleryImages = formData.images.map((url, index) => ({
                url,
                caption: '',
                order: index,
            }));

            const response = await fetch('/api/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: formData.title,
                    category: formData.category,
                    coverImage: formData.images[0] || '',
                    images: galleryImages,
                    published: formData.published,
                }),
            });

            if (response.ok) {
                router.push('/admin/gallery');
            } else {
                alert('Failed to create gallery');
            }
        } catch (error) {
            console.error('Error creating gallery:', error);
            alert('Failed to create gallery');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-gray-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-white">Create New Gallery</h1>
                    <p className="text-gray-400 mt-1">Add photos to your gallery</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            placeholder="Enter gallery title"
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <select
                            id="category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                        >
                            <option value="">Select Category</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-4">
                        <Label>Gallery Images *</Label>

                        {/* Upload Area */}
                        <label className="block border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-orange-500/50 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={uploading}
                            />
                            {uploading ? (
                                <div className="flex flex-col items-center gap-2">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
                                    <p className="text-gray-400">Uploading...</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <Upload className="w-10 h-10 text-gray-500" />
                                    <p className="text-white font-medium">Click to upload images</p>
                                    <p className="text-sm text-gray-500">Select multiple images at once</p>
                                </div>
                            )}
                        </label>

                        {/* Image Preview Grid */}
                        {formData.images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {formData.images.map((url, index) => (
                                    <div key={index} className="relative aspect-square group">
                                        <img
                                            src={url}
                                            alt={`Image ${index + 1}`}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4 text-white" />
                                        </button>
                                        {index === 0 && (
                                            <span className="absolute bottom-2 left-2 px-2 py-1 bg-orange-500 text-white text-xs rounded">
                                                Cover
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <p className="text-sm text-gray-400">
                            {formData.images.length} images uploaded. First image will be used as cover.
                        </p>
                    </div>

                    {/* Published */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="published"
                            checked={formData.published}
                            onCheckedChange={(checked) => setFormData({ ...formData, published: checked as boolean })}
                        />
                        <Label htmlFor="published" className="cursor-pointer">
                            Publish immediately
                        </Label>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="ghost" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading || formData.images.length === 0}
                        className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500"
                    >
                        {loading ? 'Creating...' : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Create Gallery
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
