"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUpload from "@/components/admin/ImageUpload";

export default function NewEventPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
        venue: '',
        featuredImage: '',
        images: [] as string[],
        category: 'Other' as const,
        status: 'Upcoming' as const,
        registrationRequired: false,
        maxAttendees: 0,
        published: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push('/admin/events');
            } else {
                alert('Failed to create event');
            }
        } catch (error) {
            console.error('Error creating event:', error);
            alert('Failed to create event');
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
                    <h1 className="text-3xl font-bold text-white">Create New Event</h1>
                    <p className="text-gray-400 mt-1">Add a new event to your calendar</p>
                </div>
            </div>

            {/* Form */}
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
                            placeholder="Enter event title"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label>Description *</Label>
                        <RichTextEditor
                            content={formData.description}
                            onChange={(content) => setFormData({ ...formData, description: content })}
                        />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date *</Label>
                            <Input
                                id="startDate"
                                type="datetime-local"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input
                                id="endDate"
                                type="datetime-local"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Location & Venue */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="location">Location *</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                required
                                placeholder="City, Country"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="venue">Venue</Label>
                            <Input
                                id="venue"
                                value={formData.venue}
                                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                placeholder="Venue name"
                            />
                        </div>
                    </div>

                    {/* Category & Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <select
                                id="category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white"
                            >
                                <option value="Festival">Festival</option>
                                <option value="Workshop">Workshop</option>
                                <option value="Meeting">Meeting</option>
                                <option value="Ceremony">Ceremony</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white"
                            >
                                <option value="Upcoming">Upcoming</option>
                                <option value="Ongoing">Ongoing</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {/* Registration */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="registrationRequired"
                                checked={formData.registrationRequired}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, registrationRequired: checked as boolean })
                                }
                            />
                            <Label htmlFor="registrationRequired" className="cursor-pointer">
                                Registration Required
                            </Label>
                        </div>

                        {formData.registrationRequired && (
                            <div className="space-y-2">
                                <Label htmlFor="maxAttendees">Max Attendees</Label>
                                <Input
                                    id="maxAttendees"
                                    type="number"
                                    value={formData.maxAttendees}
                                    onChange={(e) => setFormData({ ...formData, maxAttendees: parseInt(e.target.value) || 0 })}
                                    placeholder="0 for unlimited"
                                />
                            </div>
                        )}
                    </div>

                    {/* Featured Image */}
                    <div className="space-y-2">
                        <ImageUpload
                            label="Featured Image"
                            value={formData.featuredImage}
                            onChange={(url) => setFormData({ ...formData, featuredImage: url as string })}
                        />
                    </div>

                    {/* Additional Images */}
                    <div className="space-y-2">
                        <ImageUpload
                            label="Additional Images"
                            value={formData.images}
                            onChange={(urls) => setFormData({ ...formData, images: urls as string[] })}
                            multiple
                        />
                    </div>

                    {/* Published */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="published"
                            checked={formData.published}
                            onCheckedChange={(checked) =>
                                setFormData({ ...formData, published: checked as boolean })
                            }
                        />
                        <Label htmlFor="published" className="cursor-pointer">
                            Publish immediately
                        </Label>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.back()}
                    >
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
                                Create Event
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
