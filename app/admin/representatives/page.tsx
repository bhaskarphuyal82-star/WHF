"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, User, IdCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import VisitingCardModal from "@/components/admin/VisitingCardModal";

interface Representative {
    _id: string;
    name: string;
    position: string;
    image?: string;
    email?: string;
    phone?: string;
    status: string;
    order: number;
}

export default function RepresentativesPage() {
    const [representatives, setRepresentatives] = useState<Representative[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchRepresentatives();
    }, []);

    const fetchRepresentatives = async () => {
        try {
            const response = await fetch('/api/representatives');
            const data = await response.json();
            setRepresentatives(data.representatives || []);
        } catch (error) {
            console.error('Failed to fetch representatives:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this representative?')) return;

        try {
            const response = await fetch(`/api/representatives/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setRepresentatives(representatives.filter(r => r._id !== id));
            }
        } catch (error) {
            console.error('Failed to delete representative:', error);
        }
    };

    const [selectedRepForCard, setSelectedRepForCard] = useState<Representative | null>(null);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Representatives</h1>
                    <p className="text-gray-400 mt-1">Manage your team members and representatives</p>
                </div>
                <Button
                    onClick={() => router.push('/admin/representatives/new')}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Representative
                </Button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">
                        Loading representatives...
                    </div>
                ) : representatives.length === 0 ? (
                    <div className="p-12 text-center">
                        <User className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">No representatives yet</p>
                        <Button
                            onClick={() => router.push('/admin/representatives/new')}
                            className="bg-gradient-to-r from-orange-600 to-red-600"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Your First Representative
                        </Button>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Representative
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Position
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Order
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {representatives.map((rep) => (
                                <tr key={rep._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center overflow-hidden">
                                                {rep.image ? (
                                                    <img src={rep.image} alt={rep.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-white font-semibold">{rep.name[0]}</span>
                                                )}
                                            </div>
                                            <p className="text-white font-medium">{rep.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300 text-sm">
                                        {rep.position}
                                    </td>
                                    <td className="px-6 py-4 text-gray-300 text-sm">
                                        <div className="space-y-1">
                                            {rep.email && <div>{rep.email}</div>}
                                            {rep.phone && <div>{rep.phone}</div>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded ${rep.status === 'Active'
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {rep.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300 text-sm">
                                        {rep.order}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                title="Generate Visiting Card"
                                                className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
                                                onClick={() => setSelectedRepForCard(rep)}
                                            >
                                                <IdCard className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                                onClick={() => router.push(`/admin/representatives/edit/${rep._id}`)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                onClick={() => handleDelete(rep._id)}
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

            <VisitingCardModal
                isOpen={!!selectedRepForCard}
                onClose={() => setSelectedRepForCard(null)}
                data={selectedRepForCard}
            />
        </div>
    );
}
