"use client";

import { useEffect, useState } from "react";
import { X, Save, Loader2, CreditCard, Landmark, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/admin/ImageUpload";

type PaymentMethodType = 'esewa' | 'khalti' | 'bank' | 'fonepay';

interface PaymentMethod {
    type: PaymentMethodType;
    accountName: string;
    accountNumber: string;
    bankName?: string;
    qrCode?: string;
    isActive: boolean;
}

const PAYMENT_TYPES: { id: PaymentMethodType; label: string; icon: any }[] = [
    { id: 'esewa', label: 'eSewa', icon: CreditCard },
    { id: 'khalti', label: 'Khalti', icon: CreditCard },
    { id: 'bank', label: 'Bank Transfer', icon: Landmark },
    { id: 'fonepay', label: 'Fonepay', icon: QrCode },
];

export default function DonationSettingsPage() {
    const [activeTab, setActiveTab] = useState<PaymentMethodType>('esewa');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [methods, setMethods] = useState<Record<PaymentMethodType, PaymentMethod>>({
        esewa: { type: 'esewa', accountName: '', accountNumber: '', isActive: true },
        khalti: { type: 'khalti', accountName: '', accountNumber: '', isActive: true },
        bank: { type: 'bank', accountName: '', accountNumber: '', bankName: '', isActive: true },
        fonepay: { type: 'fonepay', accountName: '', accountNumber: '', isActive: true },
    });

    useEffect(() => {
        const fetchMethods = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/payment-methods");
                if (res.ok) {
                    const data = await res.json();
                    const newMethods = { ...methods };

                    data.forEach((method: PaymentMethod) => {
                        newMethods[method.type] = method;
                    });
                    setMethods(newMethods);
                }
            } catch (error) {
                console.error("Error fetching payment methods:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMethods();
    }, []);

    const handleSave = async (type: PaymentMethodType) => {
        setSaving(true);
        try {
            const qrCodeUrl = methods[type].qrCode;

            const response = await fetch("/api/payment-methods", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...methods[type], qrCode: qrCodeUrl }),
            });

            if (response.ok) {
                const updatedMethod = await response.json();
                setMethods(prev => ({ ...prev, [type]: updatedMethod }));
                alert(`${PAYMENT_TYPES.find(t => t.id === type)?.label} settings saved successfully!`);
            } else {
                alert("Failed to save settings");
            }
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Error saving settings");
        } finally {
            setSaving(false);
        }
    };

    const currentMethod = methods[activeTab];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">Donation Settings</h1>
                <p className="text-gray-400">Manage payment methods for donation.</p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
                {PAYMENT_TYPES.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => setActiveTab(type.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === type.id
                            ? "bg-orange-600 text-white shadow-lg shadow-orange-500/25"
                            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                            }`}
                    >
                        <type.icon className="w-4 h-4" />
                        {type.label}
                    </button>
                ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">
                        {PAYMENT_TYPES.find(t => t.id === activeTab)?.label} Configuration
                    </h2>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={currentMethod.isActive}
                            onChange={(e) => setMethods(prev => ({
                                ...prev,
                                [activeTab]: { ...prev[activeTab], isActive: e.target.checked }
                            }))}
                            className="w-4 h-4 rounded border-gray-600 text-orange-600 focus:ring-orange-500 bg-gray-700"
                        />
                        <span className="text-sm font-medium text-gray-300">Active</span>
                    </label>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-gray-300">Account Name</Label>
                            <Input
                                value={currentMethod.accountName}
                                onChange={(e) => setMethods(prev => ({
                                    ...prev,
                                    [activeTab]: { ...prev[activeTab], accountName: e.target.value }
                                }))}
                                className="bg-black/50 border-white/10 text-white"
                                placeholder="e.g. WHF Nepal"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-300">
                                {activeTab === 'esewa' || activeTab === 'khalti' ? 'eSewa/Khalti ID' : 'Account Number'}
                            </Label>
                            <Input
                                value={currentMethod.accountNumber}
                                onChange={(e) => setMethods(prev => ({
                                    ...prev,
                                    [activeTab]: { ...prev[activeTab], accountNumber: e.target.value }
                                }))}
                                className="bg-black/50 border-white/10 text-white"
                                placeholder="e.g. 98XXXXXXXX or 0000..."
                            />
                        </div>

                        {activeTab === 'bank' && (
                            <div className="space-y-2">
                                <Label className="text-gray-300">Bank Name</Label>
                                <Input
                                    value={currentMethod.bankName || ''}
                                    onChange={(e) => setMethods(prev => ({
                                        ...prev,
                                        [activeTab]: { ...prev[activeTab], bankName: e.target.value }
                                    }))}
                                    className="bg-black/50 border-white/10 text-white"
                                    placeholder="e.g. Nabil Bank"
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-300">QR Code</Label>
                        <ImageUpload
                            value={currentMethod.qrCode || ''}
                            onChange={(url) => setMethods(prev => ({
                                ...prev,
                                [activeTab]: { ...prev[activeTab], qrCode: url as string }
                            }))}
                            label="Upload QR Code"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/10">
                    <Button
                        onClick={() => handleSave(activeTab)}
                        disabled={saving}
                        className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
