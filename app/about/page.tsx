
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { Heart, Shield, Globe, Users } from "lucide-react";

export const metadata = {
    title: "About Us | World Hindu Federation Nepal",
    description: "Learn about WHF Nepal's mission, history, and dedication to preserving Hindu culture and serving the community.",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />

            <PageHero
                title="हाम्रो बारेमा"
                subtitle="विश्व हिन्दु महासंघ नेपाल: धर्म, संस्कृति र समाजसेवामा समर्पित एक अग्रणी संस्था।"
                image="/about-bg.jpg"
            />

            {/* Mission & Vision */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                        <div>
                            <h2 className="text-3xl font-bold text-foreground mb-6">हाम्रो परिचय</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                                विश्व हिन्दु महासंघ नेपाल (WHF Nepal) एउटा गैर-नाफामूलक, गैर-राजनीतिक र सामाजिक संस्था हो। हामी हिन्दु धर्म, संस्कृति, र परम्पराहरूको संरक्षण र सम्वर्धनका लागि काम गर्छौं।
                            </p>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                सन् १९८१ मा स्थापित, यो संस्थाले नेपालभर र अन्तर्राष्ट्रिय स्तरमा हिन्दु समुदायलाई एकताबद्ध गर्न, सामाजिक न्यायको वकालत गर्न र मानवीय सेवा प्रदान गर्न महत्वपूर्ण भूमिका खेल्दै आएको छ।
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-accent/50 p-6 rounded-2xl border border-border text-center">
                                <Shield className="w-10 h-10 text-orange-500 mx-auto mb-4" />
                                <h3 className="font-bold text-foreground">संरक्षण</h3>
                            </div>
                            <div className="bg-accent/50 p-6 rounded-2xl border border-border text-center">
                                <Globe className="w-10 h-10 text-orange-500 mx-auto mb-4" />
                                <h3 className="font-bold text-foreground">एकीकरण</h3>
                            </div>
                            <div className="bg-accent/50 p-6 rounded-2xl border border-border text-center">
                                <Heart className="w-10 h-10 text-orange-500 mx-auto mb-4" />
                                <h3 className="font-bold text-foreground">सेवा</h3>
                            </div>
                            <div className="bg-accent/50 p-6 rounded-2xl border border-border text-center">
                                <Users className="w-10 h-10 text-orange-500 mx-auto mb-4" />
                                <h3 className="font-bold text-foreground">सशक्तिकरण</h3>
                            </div>
                        </div>
                    </div>

                    {/* Mission Vision Cards */}
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-card border border-border rounded-xl p-8 hover:border-orange-500/30 transition-colors">
                            <span className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-4 block">Our Mission</span>
                            <h3 className="text-2xl font-bold text-card-foreground mb-4">उद्देश्य</h3>
                            <p className="text-muted-foreground">
                                सनातन हिन्दु धर्मको मूल मर्मलाई आत्मसाथ गर्दै विश्वभरका हिन्दुहरूलाई एकताबद्ध गराउने र वैदिक परम्पराहरूको संरक्षण गर्ने।
                            </p>
                        </div>
                        <div className="bg-card border border-border rounded-xl p-8 hover:border-orange-500/30 transition-colors">
                            <span className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-4 block">Our Vision</span>
                            <h3 className="text-2xl font-bold text-card-foreground mb-4">दृष्टिकोण</h3>
                            <p className="text-muted-foreground">
                                एक समतामूलक, शान्तिपूर्ण र समृद्ध समाजको निर्माण जहाँ आध्यात्मिक मूल्य र मानवीय सेवा सर्वोपरि हुन्छ।
                            </p>
                        </div>
                        <div className="bg-card border border-border rounded-xl p-8 hover:border-orange-500/30 transition-colors">
                            <span className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-4 block">Our Values</span>
                            <h3 className="text-2xl font-bold text-card-foreground mb-4">मान्यताहरू</h3>
                            <p className="text-muted-foreground">
                                सत्य, अहिंसा, सेवा, र सहअस्तित्व हाम्रो मूल मन्त्र हुन्। हामी "वसुधैव कुटुम्बकम" (विश्व एक परिवार हो) मा विश्वास गर्छौं।
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
