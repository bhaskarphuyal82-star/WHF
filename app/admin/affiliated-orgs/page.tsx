"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Globe, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Organization {
    _id: string;
    name: string;
    type: string;
    logo?: string;
    website?: string;
    location?: string;
    status: string;
    order: number;
}

export default function AffiliatedOrgsPage() {
    const [orgs, setOrgs] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchOrgs();
    }, []);

    const fetchOrgs = async () => {
        try {
            const response = await fetch('/api/affiliated-orgs');
            const data = await response.json();
            setOrgs(data.orgs || []);
        } catch (error) {
            console.error('Failed to fetch orgs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this organization?')) return;

        try {
            const response = await fetch(`/api/affiliated-orgs/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setOrgs(orgs.filter(o => o._id !== id));
            }
        } catch (error) {
            console.error('Failed to delete org:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Affiliated Organizations</h1>
                    <p className="text-gray-400 mt-1">Manage partner organizations and affiliations</p>
                </div>
                <Button
                    onClick={() => router.push('/admin/affiliated-orgs/new')}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Organization
                </Button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">Loading...</div>
                ) : orgs.length === 0 ? (
                    <div className="p-12 text-center">
                        <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">No organizations added yet</p>
                        <Button
                            onClick={() => router.push('/admin/affiliated-orgs/new')}
                            className="bg-gradient-to-r from-orange-600 to-red-600"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Organization
                        </Button>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Organization</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Order</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {orgs.map((org) => (
                                <tr key={org._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                                {org.logo ? (
                                                    <img src={org.logo} alt={org.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Building2 className="w-5 h-5 text-gray-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{org.name}</p>
                                                {org.website && (
                                                    <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                                        <Globe className="w-3 h-3" /> Visit Website
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${org.type === 'International' ? 'bg-purple-500/20 text-purple-400' :
                                                org.type === 'National' ? 'bg-blue-500/20 text-blue-400' :
                                                    'bg-green-500/20 text-green-400'
                                            }`}>
                                            {org.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300 text-sm">{org.location || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded ${org.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {org.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300 text-sm">{org.order}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                                onClick={() => router.push(`/admin/affiliated-orgs/edit/${org._id}`)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                onClick={() => handleDelete(org._id)}
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
