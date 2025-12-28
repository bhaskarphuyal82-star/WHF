"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface Event {
    _id: string;
    title: string;
    category: string;
    status: string;
    startDate: string;
    endDate?: string;
    location: string;
    published: boolean;
    currentAttendees: number;
    maxAttendees?: number;
}

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch('/api/events');
            const data = await response.json();
            setEvents(data.events || []);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            const response = await fetch(`/api/events/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setEvents(events.filter(e => e._id !== id));
            }
        } catch (error) {
            console.error('Failed to delete event:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Upcoming': return 'bg-blue-500/20 text-blue-400';
            case 'Ongoing': return 'bg-green-500/20 text-green-400';
            case 'Completed': return 'bg-gray-500/20 text-gray-400';
            case 'Cancelled': return 'bg-red-500/20 text-red-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Events</h1>
                    <p className="text-gray-400 mt-1">Manage your events and ceremonies</p>
                </div>
                <Button
                    onClick={() => router.push('/admin/events/new')}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Event
                </Button>
            </div>

            {/* Events Table */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">
                        Loading events...
                    </div>
                ) : events.length === 0 ? (
                    <div className="p-12 text-center">
                        <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">No events yet</p>
                        <Button
                            onClick={() => router.push('/admin/events/new')}
                            className="bg-gradient-to-r from-orange-600 to-red-600"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Your First Event
                        </Button>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Location
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Published
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {events.map((event) => (
                                <tr key={event._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-white font-medium">{event.title}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 text-xs font-medium bg-purple-500/20 text-purple-400 rounded">
                                            {event.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(event.status)}`}>
                                            {event.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300 text-sm">
                                        {format(new Date(event.startDate), 'MMM dd, yyyy')}
                                    </td>
                                    <td className="px-6 py-4 text-gray-300 text-sm">
                                        <div className="flex items-center">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            {event.location}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded ${event.published
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {event.published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                                onClick={() => router.push(`/admin/events/edit/${event._id}`)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                onClick={() => handleDelete(event._id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
