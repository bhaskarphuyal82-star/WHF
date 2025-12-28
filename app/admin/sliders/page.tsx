"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Slider {
    _id: string;
    title: string;
    image: string;
    active: boolean;
    order: number;
}

export default function SlidersPage() {
    const [sliders, setSliders] = useState<Slider[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSliders = async () => {
        try {
            const res = await fetch("/api/sliders?admin=true");
            const data = await res.json();
            if (data.sliders) {
                setSliders(data.sliders);
            }
        } catch (error) {
            console.error("Failed to fetch sliders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSliders();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this slider?")) return;

        try {
            const res = await fetch(`/api/sliders/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setSliders(sliders.filter((s) => s._id !== id));
            }
        } catch (error) {
            console.error("Failed to delete slider:", error);
        }
    };

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/sliders/${id}`, {
                method: "PUT",
                body: JSON.stringify({ active: !currentStatus }),
            });

            if (res.ok) {
                fetchSliders();
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Hero Sliders</h1>
                    <p className="text-gray-400 mt-1">Manage home page hero section images</p>
                </div>
                <Link href="/admin/sliders/new">
                    <Button className="bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-500 hover:to-red-500 border-0">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Slider
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6">
                {sliders.map((slider) => (
                    <div
                        key={slider._id}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-6 group hover:border-orange-500/30 transition-all"
                    >
                        <div className="relative w-48 aspect-video rounded-lg overflow-hidden bg-gray-900">
                            <Image
                                src={slider.image}
                                alt={slider.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-white">{slider.title}</h3>
                                <span
                                    className={`px-2 py-0.5 rounded text-xs font-medium border ${slider.active
                                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                                            : "bg-red-500/10 text-red-400 border-red-500/20"
                                        }`}
                                >
                                    {slider.active ? "Active" : "Inactive"}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                <span>Order: {slider.order}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleActive(slider._id, slider.active)}
                                title={slider.active ? "Deactivate" : "Activate"}
                                className="text-gray-400 hover:text-white hover:bg-white/10"
                            >
                                {slider.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>

                            <Link href={`/admin/sliders/edit/${slider._id}`}>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                            </Link>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(slider._id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}

                {sliders.length === 0 && (
                    <div className="text-center py-12 bg-white/5 border border-white/10 rounded-xl">
                        <p className="text-gray-400">No sliders found. Create one to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
