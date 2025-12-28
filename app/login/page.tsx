"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2, LogIn } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/members/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Redirect to member dashboard
                router.push("/dashboard");
                router.refresh();
            } else {
                setError(data.error || "लगइन गर्न असफल भयो");
            }
        } catch (err) {
            setError("केहि गलत भयो। कृपया पुन: प्रयास गर्नुहोस्।");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <section className="min-h-[70vh] flex items-center justify-center py-24 px-4">
                <div className="max-w-md w-full">
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center">
                            <LogIn className="w-8 h-8 text-orange-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">लगइन गर्नुहोस्</h1>
                        <p className="text-gray-400">
                            आफ्नो खातामा प्रवेश गर्नुहोस्
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-300 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    इमेल
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                    placeholder="example@email.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-300 flex items-center gap-2">
                                    <Lock className="w-4 h-4" />
                                    पासवर्ड
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-red-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        प्रवेश हुँदैछ...
                                    </>
                                ) : (
                                    "लगइन गर्नुहोस्"
                                )}
                            </button>
                            <p className="text-center text-gray-400">
                                नयाँ सदस्य हुनुहुन्छ?{" "}
                                <Link href="/register" className="text-orange-400 hover:text-orange-300">
                                    दर्ता गर्नुहोस्
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </section>

            <Footer />
        </div>
    );
}
