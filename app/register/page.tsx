"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Mail, MapPin, CheckCircle, Loader2, Camera, CreditCard, FileText, Upload } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { nepalProvinces, getDistrictsByProvince } from "@/lib/nepalAddress";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        address: {
            province: "",
            district: "",
            municipality: "",
            ward: "",
            tole: "",
        },
        membershipType: "Regular",
    });
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [receiptPreview, setReceiptPreview] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [siteSettings, setSiteSettings] = useState<any>(null);

    useEffect(() => {
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => setSiteSettings(data))
            .catch(err => console.error("Failed to fetch settings:", err));
    }, []);

    const districts = formData.address.province
        ? getDistrictsByProvince(formData.address.province)
        : [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("पासवर्ड मेल खाएन");
            return;
        }

        if (formData.password.length < 6) {
            setError("पासवर्ड कम्तिमा ६ अक्षरको हुनुपर्छ");
            return;
        }

        setLoading(true);

        try {
            let imageUrl = "";

            // Upload profile image first if selected
            if (imageFile) {
                const imageFormData = new FormData();
                imageFormData.append("file", imageFile);

                const uploadResponse = await fetch("/api/upload", {
                    method: "POST",
                    body: imageFormData,
                });

                const uploadData = await uploadResponse.json();
                if (uploadData.url) {
                    imageUrl = uploadData.url;
                }
            }

            let receiptUrl = "";
            // Upload receipt if selected
            if (receiptFile) {
                const receiptFormData = new FormData();
                receiptFormData.append("file", receiptFile);

                const uploadResponse = await fetch("/api/upload", {
                    method: "POST",
                    body: receiptFormData,
                });

                const uploadData = await uploadResponse.json();
                if (uploadData.url) {
                    receiptUrl = uploadData.url;
                }
            }

            const fee = formData.membershipType === 'Lifetime'
                ? (siteSettings?.lifetimeMembershipFee || 2501)
                : (siteSettings?.regularMembershipFee || 500);

            const response = await fetch("/api/members/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                    address: formData.address,
                    image: imageUrl,
                    membershipType: formData.membershipType,
                    paymentInfo: {
                        transactionId: transactionId,
                        receiptImage: receiptUrl,
                        amountPaid: fee,
                        paymentStatus: 'Paid'
                    }
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
            } else {
                setError(data.error || "दर्ता गर्न असफल भयो");
            }
        } catch {
            setError("केहि गलत भयो। कृपया पुन: प्रयास गर्नुहोस्।");
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setReceiptFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setReceiptPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const updateAddress = (field: string, value: string) => {
        setFormData({
            ...formData,
            address: {
                ...formData.address,
                [field]: value,
                ...(field === "province" ? { district: "", municipality: "" } : {}),
            },
        });
    };

    if (success) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Header />
                <div className="min-h-[70vh] flex items-center justify-center px-4">
                    <div className="max-w-md w-full text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-4">दर्ता सफल भयो!</h1>
                        <p className="text-gray-400 mb-8">
                            तपाईंको सदस्यता आवेदन प्राप्त भयो। हामी यसलाई समीक्षा गरिरहेछौं।
                            स्वीकृति पछि तपाईं लगइन गर्न सक्नुहुनेछ।
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-red-500 transition-all"
                        >
                            गृहपृष्ठमा फर्किनुहोस्
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <section className="py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-300 text-sm font-medium mb-6">
                            सदस्य दर्ता
                        </span>
                        <h1 className="text-4xl font-bold text-white mb-4">सदस्य बन्नुहोस्</h1>
                        <p className="text-gray-400">
                            विश्व हिन्दु महासंघ नेपालको परिवारमा सामेल हुनुहोस्
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
                                {/* Personal Info */}
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <User className="w-5 h-5 text-orange-500" />
                                        व्यक्तिगत जानकारी
                                    </h3>

                                    {/* Profile Photo Upload */}
                                    <div className="flex items-center gap-6 mb-6">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-orange-500/20 to-red-500/20 border-2 border-orange-500/30">
                                                {imagePreview ? (
                                                    <Image
                                                        src={imagePreview}
                                                        alt="Profile"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <User className="w-10 h-10 text-orange-500/50" />
                                                    </div>
                                                )}
                                            </div>
                                            <label className="absolute bottom-0 right-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-600 transition-colors border-2 border-black">
                                                <Camera className="w-4 h-4 text-white" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleImageChange}
                                                />
                                            </label>
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">प्रोफाइल फोटो</p>
                                            <p className="text-sm text-gray-500">तस्बिर अपलोड गर्नुहोस् (वैकल्पिक)</p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-300">पूरा नाम *</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                                placeholder="तपाईंको पूरा नाम"
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-300">फोन नम्बर</label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                                placeholder="९८XXXXXXXX"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Account Info */}
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <Mail className="w-5 h-5 text-orange-500" />
                                        खाता जानकारी
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-300">इमेल *</label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                                placeholder="example@email.com"
                                            />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm text-gray-300">पासवर्ड *</label>
                                                <input
                                                    type="password"
                                                    required
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                                    placeholder="कम्तिमा ६ अक्षर"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm text-gray-300">पासवर्ड पुष्टि *</label>
                                                <input
                                                    type="password"
                                                    required
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                                    placeholder="पुनः पासवर्ड लेख्नुहोस्"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Membership Type */}
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-orange-500" />
                                        सदस्यताको प्रकार छान्नुहोस्
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, membershipType: 'Regular' })}
                                            className={`p-4 rounded-xl border-2 transition-all text-left ${formData.membershipType === 'Regular'
                                                ? 'bg-orange-500/20 border-orange-500 text-white'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                                                }`}
                                        >
                                            <div className="font-bold mb-1 text-lg">साधारण सदस्य</div>
                                            <div className="text-xs opacity-70">Regular Member</div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, membershipType: 'Lifetime' })}
                                            className={`p-4 rounded-xl border-2 transition-all text-left ${formData.membershipType === 'Lifetime'
                                                ? 'bg-orange-500/20 border-orange-500 text-white'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                                                }`}
                                        >
                                            <div className="font-bold mb-1 text-lg">आजीवन सदस्य</div>
                                            <div className="text-xs opacity-70">Lifetime Member</div>
                                        </button>
                                    </div>
                                </div>

                                {/* Address */}
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-orange-500" />
                                        ठेगाना
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-300">प्रदेश *</label>
                                            <select
                                                required
                                                value={formData.address.province}
                                                onChange={(e) => updateAddress("province", e.target.value)}
                                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                            >
                                                <option value="">प्रदेश छान्नुहोस्</option>
                                                {nepalProvinces.map((prov) => (
                                                    <option key={prov.id} value={prov.id}>
                                                        {prov.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-300">जिल्ला *</label>
                                            <select
                                                required
                                                value={formData.address.district}
                                                onChange={(e) => updateAddress("district", e.target.value)}
                                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                                disabled={!formData.address.province}
                                            >
                                                <option value="">जिल्ला छान्नुहोस्</option>
                                                {districts.map((dist) => (
                                                    <option key={dist.id} value={dist.name}>
                                                        {dist.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-300">नगरपालिका/गाउँपालिका *</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.address.municipality}
                                                onChange={(e) => updateAddress("municipality", e.target.value)}
                                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                                placeholder="नगरपालिका/गाउँपालिका"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-300">वडा नं. *</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.address.ward}
                                                onChange={(e) => updateAddress("ward", e.target.value)}
                                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                                placeholder="वडा नम्बर"
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm text-gray-300">टोल</label>
                                            <input
                                                type="text"
                                                value={formData.address.tole}
                                                onChange={(e) => updateAddress("tole", e.target.value)}
                                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                                placeholder="टोल/गाउँ"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div className="pt-6 border-t border-white/10">
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-orange-500" />
                                        भुक्तानी विवरण (Payment Details)
                                    </h3>

                                    <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-6 mb-6">
                                        <p className="text-orange-200 font-bold mb-2 text-lg">
                                            जम्मा गर्नुपर्ने रकम: Rs. {formData.membershipType === 'Lifetime' ? (siteSettings?.lifetimeMembershipFee || 2501) : (siteSettings?.regularMembershipFee || 500)}
                                        </p>
                                        <div className="text-gray-300 text-sm whitespace-pre-wrap">
                                            {siteSettings?.paymentInstructions || "कृपया भुक्तानी निर्देशनहरूका लागि प्रशासकलाई सम्पर्क गर्नुहोस्।"}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-300 flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-orange-500" />
                                                ट्रान्जेक्सन आईडी (Transaction ID) *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={transactionId}
                                                onChange={(e) => setTransactionId(e.target.value)}
                                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
                                                placeholder="Enter your payment transaction ID"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-300 flex items-center gap-2">
                                                <Camera className="w-4 h-4 text-orange-500" />
                                                भुक्तानी भौचर/रसिद अपलोड गर्नुहोस् (Payment Receipt) *
                                            </label>
                                            <div className="flex flex-col gap-4">
                                                <label className="flex items-center justify-center w-full h-32 px-4 transition bg-black/50 border-2 border-white/10 border-dashed rounded-lg appearance-none cursor-pointer hover:border-orange-500/50 focus:outline-none">
                                                    {receiptPreview ? (
                                                        <div className="relative w-full h-full flex items-center justify-center p-2">
                                                            <Image src={receiptPreview} alt="Receipt Preview" fill className="object-contain" />
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center space-y-2">
                                                            <Upload className="w-8 h-8 text-gray-400" />
                                                            <span className="font-medium text-gray-400">रसिद छान्नुहोस्</span>
                                                        </div>
                                                    )}
                                                    <input type="file" name="receipt" className="hidden" accept="image/*" required onChange={handleReceiptChange} />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
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
                                            दर्ता हुँदैछ...
                                        </>
                                    ) : (
                                        "दर्ता गर्नुहोस्"
                                    )}
                                </button>
                                <p className="text-center text-gray-400">
                                    पहिले नै दर्ता भइसक्नुभयो?{" "}
                                    <Link href="/login" className="text-orange-400 hover:text-orange-300">
                                        लगइन गर्नुहोस्
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
