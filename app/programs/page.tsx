
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { BookOpen, Stethoscope, HandHeart, School, Users, Landmark, Sprout } from "lucide-react";

export const metadata = {
    title: "Programs | World Hindu Federation Nepal",
    description: "Discover our ongoing programs in education, health, and community service.",
};

export default function ProgramsPage() {
    const programs = [
        {
            title: "वैदिक शिक्षा कार्यक्रम",
            description: "नयाँ पुस्तालाई संस्कृत, वेद, र नैतिक शिक्षा प्रदान गर्न देशभर गुरुकुलहरूको सञ्चालन र सहयोग।",
            icon: BookOpen,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            title: "स्वास्थ्य शिविर",
            description: "ग्रामीण भेगमा निःशुल्क स्वास्थ्य परीक्षण र औषधी वितरण शिविरहरूको नियमित आयोजना।",
            icon: Stethoscope,
            color: "text-green-500",
            bg: "bg-green-500/10",
        },
        {
            title: "मानव सेवा",
            description: "अनाथ बालबालिका र वृद्धवृद्धाहरूको आश्रय र पालनपोषणका लागि आश्रमहरूको व्यवस्थापन।",
            icon: HandHeart,
            color: "text-red-500",
            bg: "bg-red-500/10",
        },
        {
            title: "महिला सशक्तिकरण",
            description: "महिलाहरूलाई आत्मनिर्भर बनाउन सीपमूलक तालिम र लघुवित्त कार्यक्रमहरू।",
            icon: Users,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
        },
        {
            title: "सम्पदा संरक्षण",
            description: "पुरातात्विक महत्वका मन्दिर, पाटी, पौवा र ऐतिहासिक स्थलहरूको जीर्णोद्धार र संरक्षण।",
            icon: Landmark,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
        },
        {
            title: "वातावरण संरक्षण",
            description: "वृक्षारोपण र वातावरणीय सचेतना कार्यक्रमहरू मार्फत प्रकृतिको संरक्षण।",
            icon: Sprout,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />

            <PageHero
                title="हाम्रा कार्यक्रमहरू"
                subtitle="समाज रूपान्तरण र राष्ट्र निर्माणका लागि डब्लु.एच.एफ नेपालका निरन्तर प्रयासहरू।"
                image="/programs-bg.jpg"
            />

            <section className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">हामी के गर्छौं?</h2>
                        <p className="text-muted-foreground">
                            हामी विभिन्न क्षेत्रमा केन्द्रित भएर समाजको सर्वांगीण विकासका लागि कार्यक्रमहरू सञ्चालन गरिरहेका छौं।
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {programs.map((program, index) => (
                            <div key={index} className="group p-8 rounded-2xl border border-border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className={`w-14 h-14 rounded-xl ${program.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <program.icon className={`w-7 h-7 ${program.color}`} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-orange-500 transition-colors">
                                    {program.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {program.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
