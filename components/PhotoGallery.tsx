"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    ZoomIn,
    Image as ImageIcon,
    Camera,
    Grid3X3,
    Expand
} from "lucide-react";

interface GalleryImage {
    url: string;
    caption?: string;
}

interface Gallery {
    _id: string;
    title: string;
    coverImage?: string;
    images: GalleryImage[];
}

interface PhotoGalleryProps {
    galleries: Gallery[];
}

export default function PhotoGallery({ galleries }: PhotoGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<{ url: string; title: string; caption?: string } | null>(null);
    const [currentGalleryImages, setCurrentGalleryImages] = useState<GalleryImage[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    // Get all images from galleries for the lightbox navigation
    const getAllImages = useCallback(() => {
        const allImages: { url: string; title: string; caption?: string }[] = [];
        galleries.forEach(gallery => {
            gallery.images?.forEach(img => {
                allImages.push({ url: img.url, title: gallery.title, caption: img.caption });
            });
        });
        return allImages;
    }, [galleries]);

    const handleImageClick = (gallery: Gallery, imageIndex: number = 0) => {
        const images = gallery.images || [];

        // If gallery has images, use them
        if (images.length > 0) {
            setCurrentGalleryImages(images);
            setCurrentImageIndex(imageIndex);
            setSelectedImage({
                url: images[imageIndex].url,
                title: gallery.title,
                caption: images[imageIndex].caption
            });
        }
        // Fallback: if no images but has coverImage
        else if (gallery.coverImage) {
            const fallbackImages = [{ url: gallery.coverImage, caption: '' }];
            setCurrentGalleryImages(fallbackImages);
            setCurrentImageIndex(0);
            setSelectedImage({
                url: gallery.coverImage,
                title: gallery.title,
                caption: ''
            });
        }
    };

    const closeLightbox = () => {
        setSelectedImage(null);
        setCurrentGalleryImages([]);
        setCurrentImageIndex(0);
        setIsZoomed(false);
    };

    const goToNext = useCallback(() => {
        if (currentGalleryImages.length > 0) {
            const newIndex = (currentImageIndex + 1) % currentGalleryImages.length;
            setCurrentImageIndex(newIndex);
            setSelectedImage(prev => prev ? {
                ...prev,
                url: currentGalleryImages[newIndex].url,
                caption: currentGalleryImages[newIndex].caption
            } : null);
            setIsZoomed(false);
        }
    }, [currentGalleryImages, currentImageIndex]);

    const goToPrev = useCallback(() => {
        if (currentGalleryImages.length > 0) {
            const newIndex = currentImageIndex === 0 ? currentGalleryImages.length - 1 : currentImageIndex - 1;
            setCurrentImageIndex(newIndex);
            setSelectedImage(prev => prev ? {
                ...prev,
                url: currentGalleryImages[newIndex].url,
                caption: currentGalleryImages[newIndex].caption
            } : null);
            setIsZoomed(false);
        }
    }, [currentGalleryImages, currentImageIndex]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedImage) return;

            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") goToNext();
            if (e.key === "ArrowLeft") goToPrev();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedImage, goToNext, goToPrev]);

    // Prevent body scroll when lightbox is open
    useEffect(() => {
        if (selectedImage) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [selectedImage]);

    return (
        <>
            <section className="relative py-24 bg-gradient-to-b from-black via-white/5 to-black overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 -left-32 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-red-500/10 rounded-full blur-[100px]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full mb-6"
                            >
                                <Camera className="w-4 h-4 text-orange-400" />
                                <span className="text-orange-300 text-sm font-medium">दृश्य कथाहरू</span>
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-5xl font-bold text-white"
                            >
                                फोटो ग्यालरी
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-gray-400 mt-3 max-w-lg"
                            >
                                हाम्रा कार्यक्रम र गतिविधिहरूका यादगार क्षणहरू
                            </motion.p>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <Link
                                href="/gallery"
                                className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 hover:border-orange-500/60 rounded-full text-orange-400 hover:text-orange-300 transition-all duration-300"
                            >
                                <Grid3X3 className="w-4 h-4" />
                                <span>सम्पूर्ण ग्यालरी</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Gallery Grid - Masonry-like Layout */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[250px]">
                        {galleries.map((gallery, i) => {
                            // Create an interesting asymmetric layout
                            const isLarge = i === 0;
                            const isMedium = i === 1 || i === 3;

                            return (
                                <motion.div
                                    key={gallery._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`
                                        group relative rounded-2xl overflow-hidden cursor-pointer
                                        ${isLarge ? 'col-span-2 row-span-2' : ''}
                                        ${isMedium ? 'row-span-2' : ''}
                                    `}
                                    onClick={() => handleImageClick(gallery)}
                                >
                                    {/* Image */}
                                    <div className="absolute inset-0 bg-gray-900">
                                        {gallery.coverImage || (gallery.images?.[0]?.url) ? (
                                            <Image
                                                src={gallery.coverImage || gallery.images[0].url}
                                                alt={gallery.title}
                                                fill
                                                className="object-cover transition-all duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageIcon className="w-12 h-12 text-gray-700" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                                    {/* Glass Border Effect */}
                                    <div className="absolute inset-0 border border-white/10 group-hover:border-orange-500/50 rounded-2xl transition-colors duration-300" />

                                    {/* Hover Zoom Icon */}
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        <div className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                                            <Expand className="w-5 h-5 text-white" />
                                        </div>
                                    </div>

                                    {/* Photo Count Badge */}
                                    <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
                                        <ImageIcon className="w-3.5 h-3.5 text-orange-400" />
                                        <span className="text-white text-xs font-medium">{gallery.images?.length || 0}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <h3 className="text-white font-bold text-lg md:text-xl mb-1 line-clamp-2">
                                            {gallery.title}
                                        </h3>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                            <span className="text-orange-400 text-sm font-medium">हेर्नुहोस्</span>
                                            <ArrowRight className="w-4 h-4 text-orange-400" />
                                        </div>
                                    </div>

                                    {/* Corner Accents */}
                                    <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-orange-500/0 group-hover:border-orange-500/50 rounded-tl-2xl transition-colors duration-300" />
                                    <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-orange-500/0 group-hover:border-orange-500/50 rounded-br-2xl transition-colors duration-300" />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Modern Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center"
                        onClick={closeLightbox}
                    >
                        {/* Backdrop with blur */}
                        <motion.div
                            initial={{ backdropFilter: "blur(0px)" }}
                            animate={{ backdropFilter: "blur(20px)" }}
                            exit={{ backdropFilter: "blur(0px)" }}
                            className="absolute inset-0 bg-black/90"
                        />

                        {/* Close Button */}
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ delay: 0.2 }}
                            onClick={closeLightbox}
                            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 hover:border-orange-500/50 transition-all duration-300 z-10 group"
                            aria-label="Close lightbox"
                        >
                            <X className="w-6 h-6 text-white group-hover:text-orange-400 transition-colors" />
                        </motion.button>

                        {/* Navigation - Previous */}
                        {currentGalleryImages.length > 1 && (
                            <motion.button
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ delay: 0.3 }}
                                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 md:p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 hover:border-orange-500/50 transition-all duration-300 z-10 group"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:text-orange-400 transition-colors" />
                            </motion.button>
                        )}

                        {/* Navigation - Next */}
                        {currentGalleryImages.length > 1 && (
                            <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: 0.3 }}
                                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 md:p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 hover:border-orange-500/50 transition-all duration-300 z-10 group"
                                aria-label="Next image"
                            >
                                <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:text-orange-400 transition-colors" />
                            </motion.button>
                        )}

                        {/* Main Image Container */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-6xl mx-4 md:mx-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Image Wrapper */}
                            <div
                                className={`relative aspect-[4/3] md:aspect-[16/10] rounded-2xl overflow-hidden bg-black/50 backdrop-blur-sm border border-white/10 shadow-2xl shadow-black/50 ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                                onClick={() => setIsZoomed(!isZoomed)}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={selectedImage.url}
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: isZoomed ? 1.5 : 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className="relative w-full h-full"
                                    >
                                        <Image
                                            src={selectedImage.url}
                                            alt={selectedImage.title}
                                            fill
                                            className={`object-contain transition-transform duration-300 ${isZoomed ? 'cursor-grab' : ''}`}
                                            priority
                                        />
                                    </motion.div>
                                </AnimatePresence>

                                {/* Zoom indicator */}
                                <div className="absolute bottom-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-lg border border-white/10">
                                    <ZoomIn className={`w-5 h-5 transition-colors ${isZoomed ? 'text-orange-400' : 'text-white/60'}`} />
                                </div>
                            </div>

                            {/* Image Info Bar */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="mt-4 p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                    <div>
                                        <h3 className="text-white font-bold text-lg">{selectedImage.title}</h3>
                                        {selectedImage.caption && (
                                            <p className="text-gray-400 text-sm mt-1">{selectedImage.caption}</p>
                                        )}
                                    </div>
                                    {currentGalleryImages.length > 1 && (
                                        <div className="flex items-center gap-3">
                                            {/* Thumbnail Navigation */}
                                            <div className="flex items-center gap-2">
                                                {currentGalleryImages.slice(0, 5).map((img, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => {
                                                            setCurrentImageIndex(idx);
                                                            setSelectedImage(prev => prev ? {
                                                                ...prev,
                                                                url: img.url,
                                                                caption: img.caption
                                                            } : null);
                                                        }}
                                                        className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ${currentImageIndex === idx
                                                            ? 'border-orange-500 scale-110'
                                                            : 'border-white/20 hover:border-white/40'
                                                            }`}
                                                    >
                                                        <Image
                                                            src={img.url}
                                                            alt=""
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </button>
                                                ))}
                                                {currentGalleryImages.length > 5 && (
                                                    <span className="text-gray-400 text-sm">+{currentGalleryImages.length - 5}</span>
                                                )}
                                            </div>
                                            {/* Counter */}
                                            <div className="px-4 py-2 bg-orange-500/20 rounded-full border border-orange-500/30">
                                                <span className="text-orange-400 font-medium text-sm">
                                                    {currentImageIndex + 1} / {currentGalleryImages.length}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
