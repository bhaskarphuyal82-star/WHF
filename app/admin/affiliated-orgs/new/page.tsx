"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/admin/ImageUpload";

export default function NewAffiliatedOrgPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        logo: '',
        website: '',
        location: '',
        establishedYear: '',
        type: 'National',
        order: 0,
        status: 'Active',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/affiliated-orgs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push('/admin/affiliated-orgs');
            } else {
                alert('Failed to create organization');
            }
        } catch (error) {
            console.error('Error creating organization:', error);
            alert('Failed to create organization');
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
                    <h1 className="text-3xl font-bold text-white">Add New Organization</h1>
                    <p className="text-gray-400 mt-1">Add a new affiliated organization</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Organization Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="e.g. Nepal Hindu Council"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Organization Type</Label>
                            <select
                                id="type"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:border-orange-500"
                            >
                                <option value="National">National</option>
                                <option value="International">International</option>
                                <option value="Regional">Regional</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white min-h-[100px] focus:outline-none focus:border-orange-500"
                            placeholder="Brief description of the organization..."
                        />
                    </div>

                    <div className="space-y-2">
                        <ImageUpload
                            label="Organization Logo"
                            value={formData.logo}
                            onChange={(url) => setFormData({ ...formData, logo: url as string })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="website">Website URL</Label>
                            <Input
                                id="website"
                                type="url"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="City, Country"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="establishedYear">Established Year</Label>
                            <Input
                                id="establishedYear"
                                type="number"
                                value={formData.establishedYear}
                                onChange={(e) => setFormData({ ...formData, establishedYear: e.target.value })}
                                placeholder="e.g. 1995"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
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
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:border-orange-500"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={loading} className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500">
                        {loading ? 'Creating...' : <><Save className="w-4 h-4 mr-2" /> Create Organization</>}
                    </Button>
                </div>
            </form>
        </div>
    );
}
