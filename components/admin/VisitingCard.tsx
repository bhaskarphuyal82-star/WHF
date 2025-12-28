
import React from 'react';
import { IRepresentative } from "@/models/Representative";

interface VisitingCardProps {
    data: IRepresentative;
    id: string;
    chairmanDetails?: {
        name: string;
        title: string;
        signature: string;
    };
}

export default function VisitingCard({ data, id, chairmanDetails }: VisitingCardProps) {
    // Falls back to hardcoded if not provided
    const cName = chairmanDetails?.name || 'डा. रामचन्द्र अधिकारी';
    const cTitle = chairmanDetails?.title || 'अध्यक्ष';
    const cSignature = chairmanDetails?.signature || '/signature.png';

    // Helper to add cache buster to images, but SKIP for blob/data URLs
    const getCorsUrl = (url?: string) => {
        if (!url) return "";
        if (url.startsWith('blob:') || url.startsWith('data:')) return url;
        return `${url}${url.includes('?') ? '&' : '?'}t=${new Date().getTime()}`;
    };

    // Helper to format address
    const getAddress = () => {
        const addr = (data as any).address;
        if (!addr) return null;
        const parts = [addr.municipality, addr.district].filter(Boolean);
        return parts.join(', ');
    };

    const formattedAddress = getAddress();

    return (
        <div
            id={id}
            style={{
                width: '600px',
                height: '350px',
                backgroundColor: '#ffffff',
                backgroundImage: 'radial-gradient(circle at top right, #fff7ed 0%, #ffffff 40%)',
                fontFamily: "'Inter', sans-serif",
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
        >
            {/* LARGE Watermark Background */}
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '400px',
                    height: '400px',
                    opacity: 0.08,
                    zIndex: 0,
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <img
                    src="/om-bg.png"
                    alt="Background"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
            </div>

            {/* Top Orange Bar */}
            <div style={{
                height: '8px',
                width: '100%',
                background: 'linear-gradient(90deg, #ea580c 0%, #dc2626 100%)',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 20
            }} />

            {/* Header Area */}
            <div style={{
                padding: '32px 32px 0 32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                position: 'relative',
                zIndex: 10
            }}>
                {/* Logo & Org Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img
                        src="/whf-logo.png"
                        alt="WHF Logo"
                        style={{ width: '72px', height: '72px', objectFit: 'contain' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h1 style={{
                            fontSize: '22px',
                            fontWeight: 800,
                            color: '#111827',
                            lineHeight: 1.1,
                            margin: 0,
                            fontFamily: 'Arial, sans-serif' // Fallback for specialized font
                        }}>
                            World Hindu Federation
                        </h1>
                        <h2 style={{
                            color: '#ea580c',
                            fontWeight: 700,
                            fontSize: '13px',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            marginTop: '4px',
                            margin: 0
                        }}>
                            Nepal National Chapter
                        </h2>
                    </div>
                </div>

                {/* Profile Photo - Circular with Border */}
                {data.image && (
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        border: '4px solid #fff',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        overflow: 'hidden',
                        position: 'relative',
                        zIndex: 20,
                        backgroundColor: '#f3f4f6'
                    }}>
                        <img
                            src={getCorsUrl(data.image)}
                            alt={data.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            {...(!data.image?.startsWith('blob:') && !data.image?.startsWith('data:') ? { crossOrigin: "anonymous" } : {})}
                        />
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            <div style={{
                padding: '0 32px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 10,
                marginTop: '-10px' // Pull layout up slightly
            }}>
                {/* Name & ID Row */}
                <div style={{ marginBottom: '8px' }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: 800,
                        color: '#1f2937',
                        margin: 0,
                        lineHeight: 1.2
                    }}>
                        {data.name}
                    </h2>
                </div>

                {/* Position Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <span style={{
                        color: '#ea580c',
                        fontWeight: 700,
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        {data.position}
                    </span>
                    {(data as any).memberId && (
                        <div style={{
                            backgroundColor: '#fff7ed',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#c2410c',
                            border: '1px solid #ffedd5',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <span>ID:</span>
                            <span style={{ color: '#9a3412' }}>{(data as any).memberId}</span>
                        </div>
                    )}
                </div>

                {/* Contact Details Grid - Compact */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '4px',
                    width: '100%',
                    marginTop: '8px'
                }}>
                    {data.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#374151', fontWeight: 500 }}>
                            <span style={{ color: '#ea580c', fontWeight: 700, width: '45px' }}>Phone:</span>
                            {data.phone}
                        </div>
                    )}
                    {data.email && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#374151', fontWeight: 500 }}>
                            <span style={{ color: '#ea580c', fontWeight: 700, width: '45px' }}>Email:</span>
                            {data.email}
                        </div>
                    )}
                    {formattedAddress && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#374151', fontWeight: 500, gridColumn: '1 / -1' }}>
                            <span style={{ color: '#ea580c', fontWeight: 700, width: '45px' }}>Addr:</span>
                            {formattedAddress}
                        </div>
                    )}
                </div>
            </div>

            {/* Signature Area (Bottom Right) */}
            <div style={{
                position: 'absolute',
                bottom: '24px',
                right: '32px',
                textAlign: 'center',
                zIndex: 20
            }}>
                <img
                    src={getCorsUrl(cSignature)}
                    alt="Signature"
                    style={{ height: '48px', objectFit: 'contain', marginBottom: '2px', opacity: 0.9 }}
                    {...(!cSignature?.startsWith('blob:') && !cSignature?.startsWith('data:') && !cSignature?.startsWith('/') ? { crossOrigin: "anonymous" } : {})}
                />
                <div style={{
                    borderTop: '1px solid #9ca3af',
                    width: '160px',
                    margin: '0 auto',
                    paddingTop: '4px'
                }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{cName}</div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#ea580c', textTransform: 'uppercase' }}>{cTitle}</div>
                </div>
            </div>

            {/* Bottom Accent Line */}
            <div style={{
                height: '12px',
                width: '100%',
                background: 'linear-gradient(90deg, #ea580c 0%, #dc2626 100%)',
                position: 'absolute',
                bottom: 0,
                left: 0,
                zIndex: 20
            }} />
        </div>
    );
}
