"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ImageUploadProps {
    onUploadComplete?: (url: string) => void;
    currentImage?: string;
}


export default function ImageUpload({ onUploadComplete, currentImage }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(currentImage || null);
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            return;
        }

        setError(null);

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to server
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            setUploadedUrl(data.url);
            if (onUploadComplete) {
                onUploadComplete(data.url);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
            setPreview(null);
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        setUploadedUrl(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            {!preview ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative border-2 border-dashed border-white/20 hover:border-orange-500/50 rounded-xl p-8 text-center cursor-pointer transition-all duration-300 bg-white/5 hover:bg-white/10 group"
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8 text-orange-400" />
                        </div>
                        <div>
                            <p className="text-white font-semibold mb-1">Click to upload image</p>
                            <p className="text-gray-400 text-sm">PNG, JPG or WEBP (max. 5MB)</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-white/5">
                    {/* Preview Image */}
                    <div className="relative aspect-video">
                        <Image
                            src={preview}
                            alt="Preview"
                            fill
                            className="object-cover"
                        />

                        {/* Uploading Overlay */}
                        {uploading && (
                            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                                <div className="text-center">
                                    <Loader2 className="w-12 h-12 text-orange-400 animate-spin mx-auto mb-3" />
                                    <p className="text-white font-semibold">Uploading...</p>
                                </div>
                            </div>
                        )}

                        {/* Success Indicator */}
                        {uploadedUrl && !uploading && (
                            <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium shadow-lg">
                                <Check className="w-4 h-4" />
                                Uploaded
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="p-4 flex items-center justify-between bg-black/40 backdrop-blur-sm">
                        <div className="text-sm">
                            {uploadedUrl ? (
                                <a
                                    href={uploadedUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-orange-400 hover:text-orange-300 transition-colors truncate max-w-xs block"
                                >
                                    {uploadedUrl}
                                </a>
                            ) : (
                                <span className="text-gray-400">Preparing upload...</span>
                            )}
                        </div>
                        <Button
                            onClick={handleRemove}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Remove
                        </Button>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            )}
        </div>
    );
}
