"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUpload from "@/components/admin/ImageUpload";

export default function NewRepresentativePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        bio: '',
        image: '',
        email: '',
        phone: '',
        social: {
            facebook: '',
            twitter: '',
            linkedin: '',
            instagram: '',
        },
        order: 0,
        status: 'Active' as const,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/representatives', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push('/admin/representatives');
            } else {
                alert('Failed to create representative');
            }
        } catch (error) {
            console.error('Error creating representative:', error);
            alert('Failed to create representative');
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
                    <h1 className="text-3xl font-bold text-white">Add New Representative</h1>
                    <p className="text-gray-400 mt-1">Add a new team member</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="Full name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="position">Position *</Label>
                            <Input
                                id="position"
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                required
                                placeholder="Job title"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                            id="bio"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white min-h-[100px]"
                            placeholder="Short biography"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="email@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+1 234 567 8900"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <ImageUpload
                            label="Photo"
                            value={formData.image}
                            onChange={(url) => setFormData({ ...formData, image: url as string })}
                        />
                    </div>

                    <div className="space-y-4">
                        <Label>Social Media</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                placeholder="Facebook URL"
                                value={formData.social.facebook}
                                onChange={(e) => setFormData({ ...formData, social: { ...formData.social, facebook: e.target.value } })}
                            />
                            <Input
                                placeholder="Twitter URL"
                                value={formData.social.twitter}
                                onChange={(e) => setFormData({ ...formData, social: { ...formData.social, twitter: e.target.value } })}
                            />
                            <Input
                                placeholder="LinkedIn URL"
                                value={formData.social.linkedin}
                                onChange={(e) => setFormData({ ...formData, social: { ...formData.social, linkedin: e.target.value } })}
                            />
                            <Input
                                placeholder="Instagram URL"
                                value={formData.social.instagram}
                                onChange={(e) => setFormData({ ...formData, social: { ...formData.social, instagram: e.target.value } })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="order">Display Order</Label>
                            <Input
                                id="order"
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
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
                                <Save className="w-4 h-4 mr-2" />
                                Create Representative
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
