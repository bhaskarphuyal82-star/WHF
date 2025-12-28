"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/admin/ImageUpload";

export default function EditHeritagePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        status: "Active",
        order: 0,
        image: "",
    });

    useEffect(() => {
        const fetchHeritage = async () => {
            try {
                const res = await fetch(`/api/heritages/${id}`);
                const data = await res.json();
                if (res.ok) {
                    setFormData({
                        title: data.title || "",
                        description: data.description || "",
                        location: data.location || "",
                        status: data.status || "Active",
                        order: data.order || 0,
                        image: data.image || "",
                    });
                } else {
                    alert("Heritage not found");
                    router.push("/admin/heritages");
                }
            } catch (error) {
                console.error("Error fetching heritage:", error);
            } finally {
                setFetching(false);
            }
        };
        fetchHeritage();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`/api/heritages/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push("/admin/heritages");
                router.refresh();
            } else {
                alert("Failed to update heritage");
            }
        } catch (error) {
            console.error("Error updating heritage:", error);
            alert("Error updating heritage");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="text-gray-400 hover:text-white"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <h1 className="text-2xl font-bold text-white">Edit Heritage</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-gray-300">Name *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="bg-black/50 border-white/10 text-white"
                                placeholder="e.g. Pashupatinath Temple"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location" className="text-gray-300">Location</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="bg-black/50 border-white/10 text-white"
                                placeholder="e.g. Kathmandu"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-gray-300">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="bg-black/50 border-white/10 text-white min-h-[100px]"
                            placeholder="Brief description about the heritage site..."
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="status" className="text-gray-300">Status</Label>
                            <select
                                id="status"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="order" className="text-gray-300">Display Order</Label>
                            <Input
                                id="order"
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                className="bg-black/50 border-white/10 text-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <ImageUpload
                            label="Featured Image"
                            value={formData.image}
                            onChange={(url) => setFormData({ ...formData, image: url as string })}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.back()}
                        className="text-gray-400 hover:text-white"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            "Update Heritage"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
