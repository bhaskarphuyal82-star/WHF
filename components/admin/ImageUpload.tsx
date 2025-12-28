"use client";

import { useState } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";

interface ImageUploadProps {
    value: string | string[];
    onChange: (value: string | string[]) => void;
    multiple?: boolean;
    label?: string;
}

export default function ImageUpload({ value, onChange, multiple = false, label }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);

        try {
            const uploadedUrls: string[] = [];

            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append('file', files[i]);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();
                if (data.url) {
                    uploadedUrls.push(data.url);
                }
            }

            if (multiple) {
                const currentValues = Array.isArray(value) ? value : value ? [value] : [];
                onChange([...currentValues, ...uploadedUrls]);
            } else {
                onChange(uploadedUrls[0] || '');
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleLibrarySelect = (url: string) => {
        if (multiple) {
            const currentValues = Array.isArray(value) ? value : value ? [value] : [];
            onChange([...currentValues, url]);
        } else {
            onChange(url);
        }
    };

    const removeImage = (index: number) => {
        if (multiple && Array.isArray(value)) {
            onChange(value.filter((_, i) => i !== index));
        } else {
            onChange('');
        }
    };

    const images: string[] = multiple
        ? (Array.isArray(value) ? value : value ? [value] : [])
        : value ? [value as string] : [];

    return (
        <div className="space-y-4">
            {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}

            {/* Preview */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((url, index) => (
                        <div key={index} className="relative group aspect-video rounded-lg overflow-hidden bg-white/5 border border-white/10">
                            {url && (
                                <Image
                                    src={url}
                                    alt={`Upload ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            )}
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Button */}
            {(multiple || images.length === 0) && (
                <div className="space-y-3">
                    <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-white/40 transition-colors bg-white/5">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {uploading ? (
                                <>
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-2"></div>
                                    <p className="text-sm text-gray-400">Uploading...</p>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-400">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                                </>
                            )}
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple={multiple}
                            onChange={handleUpload}
                            disabled={uploading}
                        />
                    </label>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-black px-2 text-gray-500">Or Select Existing</span>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <MediaLibraryModal
                            onSelect={handleLibrarySelect}
                            trigger={
                                <Button type="button" variant="outline" className="w-full border-dashed border-white/20 hover:bg-white/5 text-gray-400 hover:text-white">
                                    <ImageIcon className="w-4 h-4 mr-2" />
                                    Browse from Gallery
                                </Button>
                            }
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
