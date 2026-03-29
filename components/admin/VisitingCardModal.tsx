"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Loader2, FileText } from "lucide-react";
import VisitingCard from "./VisitingCard";
import html2canvas from "html2canvas";
import type { IRepresentative } from "@/models/Representative";
import { jsPDF } from "jspdf";

interface VisitingCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any | null;
}

export default function VisitingCardModal({ isOpen, onClose, data }: VisitingCardModalProps) {
    const [generating, setGenerating] = useState(false);
    const [cardData, setCardData] = useState<any>(null);
    const [proxyImage, setProxyImage] = useState<string | null>(null);
    const [settings, setSettings] = useState<{ 
        chairmanName: string; 
        chairmanTitle: string; 
        chairmanSignature: string; 
        siteName: string; 
        siteLogo: string;
    } | null>(null);

    // Fetch site settings
    useEffect(() => {
        if (isOpen) {
            fetch('/api/admin/settings')
                .then(res => res.json())
                .then(data => {
                    if (data && !data.error) {
                        setSettings(data);
                    }
                })
                .catch(err => console.error("Failed to fetch settings", err));
        }
    }, [isOpen]);

    // Fetch image and convert to Base64 to bypass CORS issues in html2canvas
    useEffect(() => {
        if (data) {
            setCardData(data);
            if (typeof data.image === 'string') {
                const fetchImage = async () => {
                    try {
                        const response = await fetch(data.image as string, { mode: 'cors' });
                        if (response.ok) {
                            const blob = await response.blob();
                            const objectUrl = URL.createObjectURL(blob);
                            setProxyImage(objectUrl);
                        } else {
                            setProxyImage(data.image as string);
                        }
                    } catch {
                        setProxyImage(data.image as string);
                    }
                };
                fetchImage();
            } else {
                setProxyImage(null);
            }
        }
    }, [data]);

    // Cleanup object URL
    useEffect(() => {
        return () => {
            if (proxyImage && proxyImage.startsWith('blob:')) {
                URL.revokeObjectURL(proxyImage);
            }
        }
    }, [proxyImage]);

    if (!data || !cardData) return null;

    // Use the proxy image if available in the card data passed to component
    const displayData = { ...cardData, image: proxyImage || cardData.image };

    // Prepare chairman details
    const chairmanDetails = settings ? {
        name: settings.chairmanName,
        title: settings.chairmanTitle,
        signature: settings.chairmanSignature
    } : undefined;

    const siteSettings = settings ? {
        siteName: settings.siteName,
        siteLogo: settings.siteLogo
    } : undefined;

    // Helper to generate canvas
    const generateCanvas = async () => {
        const element = document.getElementById(`card-${(data as any)._id}`);
        if (!element) throw new Error("Card element not found");

        // Ensure images are loaded
        const images = Array.from(element.getElementsByTagName('img'));
        await Promise.all(images.map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
                setTimeout(resolve, 3000);
            });
        }));

        await new Promise(resolve => setTimeout(resolve, 800));

        return await html2canvas(element, {
            scale: 3,
            useCORS: true,
            allowTaint: false,
            backgroundColor: '#ffffff',
            logging: false,
            imageTimeout: 15000,
            onclone: (clonedDoc) => {
                const clonedBody = clonedDoc.body;
                clonedBody.style.color = '#000000';
                clonedBody.style.background = '#ffffff';
                clonedBody.style.borderColor = 'transparent';

                const style = clonedDoc.createElement('style');
                style.innerHTML = `
                    * {
                        border-color: rgba(0,0,0,0) !important;
                        outline-color: rgba(0,0,0,0) !important;
                        -webkit-text-decoration-color: rgba(0,0,0,0) !important;
                        text-decoration-color: rgba(0,0,0,0) !important;
                    }
                `;
                clonedBody.appendChild(style);
            }
        });
    };

    const handleDownloadPNG = async () => {
        setGenerating(true);
        try {
            const canvas = await generateCanvas();
            const url = canvas.toDataURL("image/png");

            const link = document.createElement("a");
            link.download = `${(data?.name || 'card').replace(/\s+/g, '-').toLowerCase()}-card.png`;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Failed to generate PNG", err);
            alert("Could not generate card.");
        } finally {
            setGenerating(false);
        }
    };

    const handleDownloadPDF = async () => {
        setGenerating(true);
        try {
            const canvas = await generateCanvas();
            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: [89, 51]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, 51, 89);
            pdf.save(`${(data?.name || 'card').replace(/\s+/g, '-').toLowerCase()}-card.pdf`);
        } catch (err: unknown) {
            console.error("Failed to generate PDF", err);
            const message = err instanceof Error ? err.message : String(err);
            alert(`PDF Generation failed: ${message}`);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className=" bg-gray-50 border-none">
                <DialogHeader>
                    <DialogTitle className="text-gray-900 text-xl font-bold">परिचय पत्रको नमुना</DialogTitle>
                    <DialogDescription className="text-gray-500 text-sm">
                        यो पूर्वावलोकनले डाउनलोड गर्दा कार्ड कस्तो देखिन्छ भन्ने देखाउँछ।
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center gap-8 py-8 w-full overflow-y-auto max-h-[80vh]">

                    {/* Card Container with responsive scaling to fit screen */}
                    <div className="w-full flex justify-center py-2 overflow-hidden">
                        <div className="transform scale-[0.6] sm:scale-75 md:scale-90 origin-top transition-transform duration-300 -mb-[250px] sm:-mb-[150px] md:mb-0">
                            <div className="shadow-2xl rounded-xl bg-white">
                                <VisitingCard
                                    data={displayData}
                                    id={`card-${data._id}`}
                                    chairmanDetails={chairmanDetails}
                                    siteSettings={siteSettings}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button variant="outline" onClick={onClose} disabled={generating}>
                            बन्द गर्नुहोस्
                        </Button>

                        <Button
                            onClick={handleDownloadPDF}
                            disabled={generating}
                            variant="secondary"
                            className="bg-gray-800 hover:bg-gray-900 text-white min-w-[150px]"
                        >
                            {generating ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <FileText className="w-4 h-4 mr-2" />
                            )}
                            PDF डाउनलोड गर्नुहोस्
                        </Button>

                        <Button
                            onClick={handleDownloadPNG}
                            disabled={generating}
                            className="bg-orange-600 hover:bg-orange-700 text-white min-w-[150px]"
                        >
                            {generating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    प्रक्रिया हुँदैछ...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4 mr-2" />
                                    PNG डाउनलोड गर्नुहोस्
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

