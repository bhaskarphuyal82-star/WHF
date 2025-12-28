
"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log("Form submitted:", formData);
        alert("तपाईंको सन्देश प्राप्त भयो। धन्यवाद!");
        setFormData({ name: "", email: "", subject: "", message: "" });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />

            <PageHero
                title="सम्पर्कनुहोस्"
                subtitle="हामी तपाईंको जिज्ञासा र सुझावको सधैं कदर गर्छौं।"
                image="/contact-bg.jpg"
            />

            <section className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16">
                        {/* Contact Info */}
                        <div>
                            <h2 className="text-3xl font-bold mb-8 text-foreground">सम्पर्क विवरण</h2>
                            <p className="text-muted-foreground text-lg mb-12">
                                कुनै पनि प्रश्न, सुझाव वा सहयोगको लागि हामीलाई सिधै सम्पर्क गर्न सक्नुहुन्छ।
                            </p>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                                        <MapPin className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 text-foreground">हाम्रो कार्यालय</h3>
                                        <p className="text-muted-foreground">सानो भर्याङ, काठमाडौं ४४६००<br />नेपाल</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                                        <Phone className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 text-foreground">फोन नम्बर</h3>
                                        <p className="text-muted-foreground">01-5249557</p>
                                        <p className="text-xs text-muted-foreground mt-1">आइतबार - शुक्रबार, १०:०० - ५:००</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                                        <Mail className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 text-foreground">इमेल</h3>
                                        <p className="text-muted-foreground">info@whfnepal.org</p>
                                        <p className="text-muted-foreground">support@whfnepal.org</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                            <h2 className="text-2xl font-bold mb-6 text-foreground">सन्देश पठाउनुहोस्</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">पूरा नाम</label>
                                        <Input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="तपाईंको नाम"
                                            required
                                            className="bg-accent/50 border-input"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">इमेल</label>
                                        <Input
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="you@company.com"
                                            required
                                            className="bg-accent/50 border-input"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">विषय</label>
                                    <Input
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="सन्देशको विषय"
                                        required
                                        className="bg-accent/50 border-input"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">सन्देश</label>
                                    <Textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="तपाईंको सन्देश यहाँ लेख्नुहोस्..."
                                        rows={6}
                                        required
                                        className="bg-accent/50 border-input min-h-[150px]"
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white">
                                    <Send className="w-4 h-4 mr-2" />
                                    पठाउनुहोस्
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Embed */}
            <section className="h-[400px] w-full bg-accent/30 relative grayscale hover:grayscale-0 transition-all duration-500">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.064560127885!2d85.3409!3d27.7153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQyJzU1LjEiTiA4NcKwMjAnMjcuMiJF!5e0!3m2!1sen!2snp!4v1620000000000!5m2!1sen!2snp"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </section>

            <Footer />
        </div>
    );
}
