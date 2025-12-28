"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

interface Slider {
    _id: string;
    title: string;
    subtitle?: string;
    image: string;
    link?: string;
}

// Spotlight effect component
const Spotlight = ({ className = "" }: { className?: string }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className={`absolute inset-0 pointer-events-none ${className}`}
        >
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-red-500/15 rounded-full blur-[100px] animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[150px]" />
        </motion.div>
    );
};

// Animated text component
const AnimatedTitle = ({ text }: { text: string }) => {
    const words = text.split(" ");

    return (
        <motion.h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 50, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{
                        duration: 0.8,
                        delay: i * 0.15,
                        ease: [0.215, 0.61, 0.355, 1],
                    }}
                    className="inline-block mr-4"
                    style={{ perspective: "1000px" }}
                >
                    {word}
                </motion.span>
            ))}
        </motion.h1>
    );
};

// Floating particles
const FloatingParticles = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-orange-400/30 rounded-full"
                    initial={{
                        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                    }}
                    animate={{
                        y: [null, Math.random() * -500],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                    }}
                />
            ))}
        </div>
    );
};

// Grid background
const GridBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden opacity-20">
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px',
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
        </div>
    );
};

export default function HeroSlider() {
    const [sliders, setSliders] = useState<Slider[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        const fetchSliders = async () => {
            try {
                const res = await fetch("/api/sliders");
                const data = await res.json();
                if (data.sliders && data.sliders.length > 0) {
                    setSliders(data.sliders);
                }
            } catch (error) {
                console.error("Failed to fetch sliders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSliders();
    }, []);

    useEffect(() => {
        if (sliders.length > 1) {
            const timer = setInterval(() => {
                setDirection(1);
                setCurrentIndex((prev) => (prev + 1) % sliders.length);
            }, 7000);
            return () => clearInterval(timer);
        }
    }, [sliders.length]);

    const paginate = useCallback((newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex((prev) => {
            if (newDirection === 1) {
                return (prev + 1) % sliders.length;
            }
            return prev === 0 ? sliders.length - 1 : prev - 1;
        });
    }, [sliders.length]);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? "100%" : "-100%",
            opacity: 0,
            scale: 1.2,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                duration: 1.2,
                ease: [0.25, 0.46, 0.45, 0.94] as const,
            },
        },
        exit: (direction: number) => ({
            x: direction > 0 ? "-50%" : "50%",
            opacity: 0,
            scale: 0.9,
            transition: {
                duration: 0.8,
            },
        }),
    };

    if (loading) {
        return (
            <div className="relative min-h-screen flex items-center justify-center bg-black">
                <motion.div
                    className="relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="w-16 h-16 border-4 border-orange-500/30 rounded-full" />
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </motion.div>
            </div>
        );
    }

    // Default static hero if no sliders found
    if (sliders.length === 0) {
        return (
            <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
                <GridBackground />
                <Spotlight />
                <FloatingParticles />

                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full mb-8 backdrop-blur-xl"
                    >
                        <Sparkles className="w-5 h-5 text-orange-400" />
                        <span className="text-orange-300 text-sm font-medium tracking-wider">
                            गैर-नाफामूलक संस्था
                        </span>
                    </motion.div>

                    <AnimatedTitle text="विश्व हिन्दु महासंघ नेपाल" />

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-xl text-gray-300/80 mb-12 max-w-3xl mx-auto leading-relaxed mt-8"
                    >
                        हामी हिन्दु आध्यात्मिक मूल्यहरू, सांस्कृतिक परम्पराहरू, र नेपाल र बाहिर समुदायको कल्याण प्रवर्द्धन गर्न समर्पित छौं।
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            href="/contact"
                            className="group relative px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-full overflow-hidden transition-all duration-500"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                संलग्न हुनुहोस्
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <Link
                            href="/about"
                            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-semibold rounded-full backdrop-blur-xl transition-all duration-300 hover:border-orange-500/50"
                        >
                            थप जान्नुहोस्
                        </Link>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-1.5 h-3 bg-gradient-to-b from-orange-400 to-red-400 rounded-full"
                        />
                    </div>
                </motion.div>
            </section>
        );
    }

    const currentSlide = sliders[currentIndex];

    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* Animated Background Images */}
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src={currentSlide.image}
                        alt={currentSlide.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
                </motion.div>
            </AnimatePresence>

            {/* Spotlight Effects */}
            <Spotlight />

            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '30px 30px',
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        className="max-w-5xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Subtitle Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full mb-8 backdrop-blur-xl"
                        >
                            <Sparkles className="w-5 h-5 text-orange-400 animate-pulse" />
                            <span className="text-orange-300 text-sm font-medium tracking-wider uppercase">
                                {currentSlide.subtitle || "Welcome to WHF Nepal"}
                            </span>
                        </motion.div>

                        {/* Title with staggered animation */}
                        <motion.h1
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
                            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight"
                        >
                            {currentSlide.title.split(" ").map((word, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                                    className="inline-block mr-4"
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </motion.h1>

                        {/* CTA Button */}
                        {currentSlide.link && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                            >
                                <Link
                                    href={currentSlide.link}
                                    className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold text-lg rounded-full overflow-hidden shadow-2xl shadow-orange-500/30"
                                >
                                    <span className="relative z-10">थप जान्नुहोस्</span>
                                    <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <motion.div
                                        className="absolute inset-0 bg-white/20"
                                        initial={{ x: "-100%" }}
                                        whileHover={{ x: "100%" }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </Link>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Modern Indicators */}
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20">
                <div className="flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-xl rounded-full border border-white/10">
                    {sliders.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setDirection(index > currentIndex ? 1 : -1);
                                setCurrentIndex(index);
                            }}
                            className="relative group"
                            aria-label={`Go to slide ${index + 1}`}
                        >
                            <div className={`w-2 h-2 rounded-full transition-all duration-500 ${index === currentIndex
                                ? "bg-orange-500 w-8"
                                : "bg-white/30 group-hover:bg-white/50"
                                }`} />
                            {index === currentIndex && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="absolute inset-0 bg-orange-500 rounded-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Modern Navigation Arrows */}
            <button
                onClick={() => paginate(-1)}
                className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 items-center justify-center text-white hover:bg-white/10 hover:border-orange-500/50 transition-all duration-300 group z-20"
            >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
                onClick={() => paginate(1)}
                className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 items-center justify-center text-white hover:bg-white/10 hover:border-orange-500/50 transition-all duration-300 group z-20"
            >
                <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
                <motion.div
                    key={currentIndex}
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 7, ease: "linear" }}
                />
            </div>
        </section>
    );
}
