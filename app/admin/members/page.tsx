"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Check, X, Eye, Trash2, Search, Filter, LayoutGrid, Table as TableIcon, MapPin, Phone, Mail, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { nepalProvinces } from "@/lib/nepalAddress";
import VisitingCardModal from "@/components/admin/VisitingCardModal";

interface Member {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    image?: string;
    address?: {
        province: string;
        district: string;
        municipality: string;
        ward: string;
        tole?: string;
    };
    membershipStatus: 'Pending' | 'Approved' | 'Rejected';
    membershipDate?: string;
    createdAt: string;
}

export default function MembersPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [selectedMemberForCard, setSelectedMemberForCard] = useState<any | null>(null);
    const router = useRouter();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchMembers();
        }, 500); // Debounce search
        return () => clearTimeout(timeoutId);
    }, [statusFilter, searchQuery]);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (statusFilter) params.append('status', statusFilter);
            if (searchQuery) params.append('search', searchQuery);

            const response = await fetch(`/api/members?${params.toString()}`);
            const data = await response.json();
            setMembers(data.members || []);
        } catch (error) {
            console.error('Failed to fetch members:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateMemberStatus = async (id: string, status: 'Approved' | 'Rejected') => {
        try {
            const response = await fetch(`/api/members/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ membershipStatus: status }),
            });

            if (response.ok) {
                fetchMembers();
            }
        } catch (error) {
            console.error('Failed to update member:', error);
        }
    };

    const deleteMember = async (id: string) => {
        if (!confirm('Are you sure you want to delete this member?')) return;

        try {
            const response = await fetch(`/api/members/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setMembers(members.filter(m => m._id !== id));
            }
        } catch (error) {
            console.error('Failed to delete member:', error);
        }
    };

    const getProvinceName = (provinceId: string) => {
        const province = nepalProvinces.find(p => p.id === provinceId);
        return province?.name || provinceId;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Approved':
                return <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded">Approved</span>;
            case 'Pending':
                return <span className="px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded">Pending</span>;
            case 'Rejected':
                return <span className="px-2 py-1 text-xs font-medium bg-red-500/20 text-red-400 rounded">Rejected</span>;
            default:
                return <span className="px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded">Pending</span>;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const ActionButtons = ({ member }: { member: Member }) => (
        <div className="flex items-center gap-2">
            <Button
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 text-white h-8 w-8 p-0"
                title="Generate Card"
                onClick={() => setSelectedMemberForCard({
                    ...member,
                    position: 'General Member' // Default position
                })}
            >
                <CreditCard className="w-4 h-4" />
            </Button>
            {(!member.membershipStatus || member.membershipStatus === 'Pending') && (
                <>
                    <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-500 text-white h-8 w-8 p-0"
                        title="Approve"
                        onClick={() => {
                            if (confirm(`${member.name} लाई स्वीकृत गर्ने?`)) {
                                updateMemberStatus(member._id, 'Approved');
                            }
                        }}
                    >
                        <Check className="w-4 h-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-500 h-8 w-8 p-0"
                        title="Reject"
                        onClick={() => {
                            if (confirm(`${member.name} को आवेदन अस्वीकार गर्ने?`)) {
                                updateMemberStatus(member._id, 'Rejected');
                            }
                        }}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </>
            )}
            {member.membershipStatus === 'Rejected' && (
                <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-500 text-white h-8 w-8 p-0"
                    title="Re-Approve"
                    onClick={() => updateMemberStatus(member._id, 'Approved')}
                >
                    <Check className="w-4 h-4" />
                </Button>
            )}
            {member.membershipStatus === 'Approved' && (
                <Button
                    size="sm"
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10 h-8 w-8 p-0"
                    title="Revoke"
                    onClick={() => {
                        if (confirm(`${member.name} को सदस्यता रद्द गर्ने?`)) {
                            updateMemberStatus(member._id, 'Rejected');
                        }
                    }}
                >
                    <X className="w-4 h-4" />
                </Button>
            )}
            <Button
                size="sm"
                variant="ghost"
                className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 p-0"
                title="Delete"
                onClick={() => deleteMember(member._id)}
            >
                <Trash2 className="w-4 h-4" />
            </Button>
        </div>
    );


    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Members</h1>
                    <p className="text-gray-400 mt-1">Manage member registrations</p>
                </div>
                <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            type="text"
                            placeholder="Search members..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/5 border-white/10 text-white pl-10 w-[200px] sm:w-[250px]"
                        />
                    </div>

                    <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            className={`h-8 w-8 p-0 ${viewMode === 'table' ? 'bg-white/10 text-white' : 'text-gray-400'}`}
                            onClick={() => setViewMode('table')}
                        >
                            <TableIcon className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className={`h-8 w-8 p-0 ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-400'}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </Button>
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    >
                        <option value="">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                    <p className="text-yellow-400 text-sm">Pending</p>
                    <p className="text-2xl font-bold text-white">
                        {members.filter(m => !m.membershipStatus || m.membershipStatus === 'Pending').length}
                    </p>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                    <p className="text-green-400 text-sm">Approved</p>
                    <p className="text-2xl font-bold text-white">
                        {members.filter(m => m.membershipStatus === 'Approved').length}
                    </p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <p className="text-red-400 text-sm">Rejected</p>
                    <p className="text-2xl font-bold text-white">
                        {members.filter(m => m.membershipStatus === 'Rejected').length}
                    </p>
                </div>
            </div>

            {/* Content View */}
            {loading ? (
                <div className="p-12 text-center text-gray-400 bg-white/5 rounded-xl border border-white/10">
                    Loading members...
                </div>
            ) : members.length === 0 ? (
                <div className="p-12 text-center bg-white/5 rounded-xl border border-white/10">
                    <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No members found</p>
                </div>
            ) : viewMode === 'table' ? (
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Member</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Address</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Date</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {members.map((member) => (
                                <tr key={member._id} className="hover:bg-white/5">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gray-700 flex-shrink-0 overflow-hidden">
                                                {member.image ? (
                                                    <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-gray-500">
                                                        <Users className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{member.name}</p>
                                                <p className="text-gray-400 text-sm">{member.email}</p>
                                                {member.phone && (
                                                    <p className="text-gray-500 text-sm">{member.phone}</p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {member.address && (
                                            <div className="text-sm text-gray-400">
                                                <p>{member.address.municipality}, {member.address.ward}</p>
                                                <p>{member.address.district}</p>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(member.membershipStatus)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">
                                        {formatDate(member.createdAt)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end">
                                            <ActionButtons member={member} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {members.map((member) => (
                        <div key={member._id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden flex flex-col group hover:border-white/20 transition-all">
                            <div className="aspect-[4/3] w-full bg-gray-800 relative">
                                {member.image ? (
                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-600">
                                        <Users className="w-12 h-12 mb-2" />
                                        <span className="text-sm">No Image</span>
                                    </div>
                                )}
                                <div className="absolute top-2 right-2">
                                    {getStatusBadge(member.membershipStatus)}
                                </div>
                            </div>

                            <div className="p-4 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                                <div className="space-y-2 mt-2 flex-1">
                                    {member.email && (
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <Mail className="w-4 h-4 text-orange-400" />
                                            <span className="truncate">{member.email}</span>
                                        </div>
                                    )}
                                    {member.phone && (
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <Phone className="w-4 h-4 text-orange-400" />
                                            <span>{member.phone}</span>
                                        </div>
                                    )}
                                    {member.address && (
                                        <div className="flex items-start gap-2 text-sm text-gray-400">
                                            <MapPin className="w-4 h-4 text-orange-400 mt-0.5" />
                                            <div>
                                                <p>{member.address.tole ? `${member.address.tole}, ` : ''}{member.address.ward ? `Ward ${member.address.ward}` : ''}</p>
                                                <p>{member.address.municipality}, {member.address.district}</p>
                                                <p className="text-xs text-gray-500">{getProvinceName(member.address.province)}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Joined {formatDate(member.createdAt)}</span>
                                    <ActionButtons member={member} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* Visiting Card Modal */}
            {selectedMemberForCard && (
                <VisitingCardModal
                    isOpen={!!selectedMemberForCard}
                    onClose={() => setSelectedMemberForCard(null)}
                    data={selectedMemberForCard}
                />
            )}
        </div>
    );
}
