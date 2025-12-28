"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Image as ImageIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MediaLibraryModalProps {
    onSelect: (url: string) => void;
    trigger?: React.ReactNode;
}

interface ImageItem {
    url: string;
    source: string; // 'Gallery: Title'
    date: string;
}

export default function MediaLibraryModal({ onSelect, trigger }: MediaLibraryModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<ImageItem[]>([]);
    const [filteredImages, setFilteredImages] = useState<ImageItem[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (open && images.length === 0) {
            fetchImages();
        }
    }, [open]);

    useEffect(() => {
        if (!search.trim()) {
            setFilteredImages(images);
        } else {
            const query = search.toLowerCase();
            setFilteredImages(images.filter(img =>
                img.source.toLowerCase().includes(query)
            ));
        }
    }, [search, images]);

    const fetchImages = async () => {
        setLoading(true);
        try {
            // Fetch from unified Media API
            const res = await fetch("/api/media?limit=50");
            if (res.ok) {
                const data = await res.json();

                // Map API response to ImageItem interface
                const mediaImages = data.images.map((img: any) => ({
                    url: img.url,
                    source: `Uploaded: ${new Date(img.date).toLocaleDateString()}`,
                    date: img.date
                }));

                setImages(mediaImages);
                setFilteredImages(mediaImages);
            }
        } catch (error) {
            console.error("Error fetching images:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (url: string) => {
        onSelect(url);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" className="gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Browse Library
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-4xl bg-gray-900 border-white/10 text-white h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Select Image</DialogTitle>
                </DialogHeader>

                <div className="flex items-center gap-2 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search by gallery title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 bg-black/50 border-white/10 text-white"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto min-h-0 bg-black/20 rounded-xl p-4 border border-white/10">
                    {loading ? (
                        <div className="h-full flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                        </div>
                    ) : filteredImages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
                            <p>No images found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {filteredImages.map((img, idx) => (
                                <div
                                    key={`${img.url}-${idx}`}
                                    className="group relative aspect-square bg-black/50 rounded-lg overflow-hidden border border-white/10 hover:border-orange-500/50 cursor-pointer transition-all"
                                    onClick={() => handleSelect(img.url)}
                                >
                                    <Image
                                        src={img.url}
                                        alt={img.source}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                        sizes="(max-width: 768px) 50vw, 20vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                                        <p className="text-xs text-white truncate">{img.source}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
