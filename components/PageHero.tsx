
import Image from "next/image";

interface PageHeroProps {
    title: string;
    subtitle?: string;
    image?: string;
}

export default function PageHero({ title, subtitle, image = "/hero-bg.jpg" }: PageHeroProps) {
    return (
        <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/60 z-10" />
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <span className="inline-block py-1 px-3 rounded-full bg-orange-500/20 text-orange-400 text-sm font-medium mb-4 backdrop-blur-sm border border-orange-500/30">
                    World Hindu Federation Nepal
                </span>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
                        {subtitle}
                    </p>
                )}
            </div>
        </section>
    );
}
