"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUpload from "@/components/admin/ImageUpload";

const CATEGORIES = [
    "Festival",
    "Event",
    "Community",
    "Religious",
    "Cultural",
    "Meeting",
    "Other"
];

export default function EditGalleryPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        images: [] as string[],
        published: false,
    });

    useEffect(() => {
        fetchGallery();
    }, [id]);

    const fetchGallery = async () => {
        try {
            const response = await fetch(`/api/gallery/${id}`);
            const data = await response.json();

            if (data.gallery) {
                const gallery = data.gallery;
                let imageUrls = gallery.images?.map((img: any) => img.url) || [];

                // If no images but has coverImage, use coverImage
                if (imageUrls.length === 0 && gallery.coverImage) {
                    imageUrls = [gallery.coverImage];
                }

                setFormData({
                    title: gallery.title || '',
                    category: gallery.category || '',
                    images: imageUrls,
                    published: gallery.published || false,
                });
            }
        } catch (error) {
            console.error('Error fetching gallery:', error);
        } finally {
            setFetching(false);
        }
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

            const response = await fetch(`/api/gallery/${id}`, {
                method: 'PUT',
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
                alert('Failed to update gallery');
            }
        } catch (error) {
            console.error('Error updating gallery:', error);
            alert('Failed to update gallery');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-gray-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-white">Edit Gallery</h1>
                    <p className="text-gray-400 mt-1">Update gallery photos</p>
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
                        <ImageUpload
                            label="Gallery Images *"
                            value={formData.images}
                            onChange={(urls) => setFormData(prev => ({ ...prev, images: urls as string[] }))}
                            multiple={true}
                        />

                        {formData.images.length > 0 && (
                            <p className="text-sm text-gray-400 mt-2">
                                {formData.images.length} images. First image is the cover.
                            </p>
                        )}
                    </div>

                    {/* Published */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="published"
                            checked={formData.published}
                            onCheckedChange={(checked) => setFormData({ ...formData, published: checked as boolean })}
                        />
                        <Label htmlFor="published" className="cursor-pointer">
                            Published
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
                        {loading ? 'Saving...' : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
