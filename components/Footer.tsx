import Link from "next/link";

const Footer = () => {
    return (
        <footer className="relative py-12 border-t border-white/10 bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    {/* Organization Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">विश्व हिन्दु महासंघ नेपाल</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            हिन्दु आध्यात्मिक मूल्यहरू, सांस्कृतिक परम्पराहरू, र नेपालभरि सामुदायिक कल्याणको संरक्षण र प्रवर्द्धन गर्न प्रतिबद्ध।
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">द्रुत लिङ्कहरू</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="/" className="hover:text-orange-400 transition-colors">गृहपृष्ठ</Link></li>
                            <li><Link href="/about" className="hover:text-orange-400 transition-colors">हाम्रो बारेमा</Link></li>
                            <li><Link href="/events" className="hover:text-orange-400 transition-colors">कार्यक्रमहरू</Link></li>
                            <li><Link href="/contact" className="hover:text-orange-400 transition-colors">सम्पर्क</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">सम्पर्क</h3>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li className="flex items-start gap-3">
                                <span className="text-orange-400">📍</span>
                                <div>
                                    <p>सानो भर्याङ, काठमाडौं ४४६००</p>
                                    <p>Sano bharang, Kathmandu 44600</p>
                                </div>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-orange-400">📞</span>
                                <a href="tel:01-5249557" className="hover:text-white transition-colors">01-5249557</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-orange-400">✉️</span>
                                <a href="mailto:info@whfnepal.org" className="hover:text-white transition-colors">info@whfnepal.org</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} विश्व हिन्दु महासंघ नेपाल. सबै अधिकार सुरक्षित।
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
