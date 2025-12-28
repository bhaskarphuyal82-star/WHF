"use client";

import { useEffect, useState } from "react";
import { Loader2, Copy, Check, CreditCard, Landmark, QrCode } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface PaymentMethod {
    type: 'esewa' | 'khalti' | 'bank' | 'fonepay';
    accountName: string;
    accountNumber: string;
    bankName?: string;
    qrCode?: string;
}

const TYPE_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
    esewa: { label: 'eSewa', color: 'bg-[#60bb46]', icon: CreditCard },
    khalti: { label: 'Khalti', color: 'bg-[#5c2d91]', icon: CreditCard },
    bank: { label: 'Bank Transfer', color: 'bg-blue-600', icon: Landmark },
    fonepay: { label: 'Fonepay', color: 'bg-[#c62828]', icon: QrCode },
};

export default function DonatePage() {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState<string | null>(null);

    useEffect(() => {
        const fetchMethods = async () => {
            try {
                const res = await fetch("/api/payment-methods");
                if (res.ok) {
                    const allMethods = await res.json();
                    setMethods(allMethods.filter((m: any) => m.isActive));
                }
            } catch (error) {
                console.error("Error fetching payment methods:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMethods();
    }, []);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(null), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">
                        Support Our Cause
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Your contribution helps us preserve and promote Nepal's rich cultural heritage.
                        Choose your preferred payment method below.
                    </p>
                </div>

                {methods.length === 0 ? (
                    <div className="text-center text-gray-500 py-12 bg-white/5 rounded-2xl border border-white/10">
                        <p>No payment methods currently available.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {methods.map((method) => {
                            const config = TYPE_CONFIG[method.type];
                            return (
                                <div
                                    key={method.type}
                                    className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all duration-300 group"
                                >
                                    <div className={`${config.color} p-4 flex items-center justify-between`}>
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                                <config.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="font-bold text-xl">{config.label}</h3>
                                        </div>
                                        {method.bankName && (
                                            <span className="text-sm font-medium bg-black/20 px-3 py-1 rounded-full">
                                                {method.bankName}
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-6 space-y-6">
                                        <div className="space-y-4">
                                            <div className="bg-black/30 p-4 rounded-xl space-y-1 group/item hover:bg-black/50 transition-colors">
                                                <p className="text-xs text-gray-500 uppercase font-medium">Account Name</p>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-white font-medium">{method.accountName}</p>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => copyToClipboard(method.accountName)}
                                                        className="text-gray-400 hover:text-white h-6 w-6 p-0"
                                                    >
                                                        {copied === method.accountName ? (
                                                            <Check className="w-3 h-3 text-green-500" />
                                                        ) : (
                                                            <Copy className="w-3 h-3" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="bg-black/30 p-4 rounded-xl space-y-1 group/item hover:bg-black/50 transition-colors">
                                                <p className="text-xs text-gray-500 uppercase font-medium">
                                                    {method.type === 'esewa' || method.type === 'khalti' ? 'Wallet ID' : 'Account Number'}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-white font-medium font-mono text-lg tracking-wide">{method.accountNumber}</p>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => copyToClipboard(method.accountNumber)}
                                                        className="text-gray-400 hover:text-white h-6 w-6 p-0"
                                                    >
                                                        {copied === method.accountNumber ? (
                                                            <Check className="w-3 h-3 text-green-500" />
                                                        ) : (
                                                            <Copy className="w-3 h-3" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {method.qrCode && (
                                            <div className="border-t border-white/10 pt-6">
                                                <div className="flex justify-center">
                                                    <div className="bg-white p-4 rounded-xl shadow-lg">
                                                        <div className="relative w-48 h-48">
                                                            <Image
                                                                src={method.qrCode}
                                                                alt={`${config.label} QR Code`}
                                                                fill
                                                                className="object-contain"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-center text-sm text-gray-400 mt-4">
                                                    Scan to pay with {config.label}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
