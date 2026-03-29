
import React from 'react';
import type { IRepresentative } from "@/models/Representative";

interface VisitingCardProps {
    data: IRepresentative;
    id: string;
    chairmanDetails?: {
        name: string;
        title: string;
        signature: string;
    };
    siteSettings?: {
        siteName: string;
        siteLogo: string;
    };
}

export default function VisitingCard({ data, id, chairmanDetails, siteSettings }: VisitingCardProps) {
    const cSignature = chairmanDetails?.signature || '/signature.png';
    const sName = siteSettings?.siteName || 'विश्व हिन्दु महासंघ नेपाल';
    const sLogo = siteSettings?.siteLogo || '/whf-logo.png';

    const getCorsUrl = (url?: string) => {
        if (!url) return "";
        if (url.startsWith('blob:') || url.startsWith('data:')) return url;
        // Add cache buster for fresh renders
        return `${url}${url.includes('?') ? '&' : '?'}t=${new Date().getTime()}`;
    };    const getAddress = () => {
        const addr = (data as any).address;
        if (!addr) return "ललितपुर, नेपाल";
        const parts = [addr.municipality, addr.district].filter(Boolean);
        return parts.join(', ');
    };

    const getPosition = () => {
        const pos = data.position || '';
        if (pos === 'Regular Member') return 'साधारण सदस्य';
        if (pos === 'Lifetime Member') return 'आजीवन सदस्य';
        return pos || 'साधारण सदस्य';
    };
    return (
        <div
            id={id}
            style={{
                width: '400px',
                height: '640px',
                backgroundColor: '#ffffff',
                fontFamily: "'Noto Sans Devanagari', sans-serif, 'Arial'",
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                color: '#333'
            }}
        >
            {/* 1. ORANGE HEADER SECTION */}
            <div style={{
                height: '220px',
                width: '100%',
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: '35px',
                color: 'white',
                borderBottomLeftRadius: '50% 15px',
                borderBottomRightRadius: '50% 15px',
                zIndex: 10
            }}>
                {/* Registration Number Top Right */}
                <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '15px',
                    fontSize: '10px',
                    fontWeight: 600,
                    opacity: 0.9
                }}>
                    दर्ता नं. जि.प्र.का. काठमाडौं ३३८ / ०६० / ०६१
                </div>

                {/* Logo & Flags Container */}
                <div style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    padding: '0 25px',
                    marginTop: '5px'
                }}>
                    {/* Organization Logo */}
                    <div style={{
                        width: '65px',
                        height: '65px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                        <img src={getCorsUrl(sLogo)} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>

                    {/* DHARMA & MOTTO */}
                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: '20px', fontWeight: 900, marginBottom: '2px' }}>ॐ</div>
                        <div style={{ fontSize: '11px', fontWeight: 600, fontStyle: 'italic', letterSpacing: '0.05em' }}>&quot;धर्मी रक्षति रक्षितः&quot;</div>
                    </div>

                    {/* Flags */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <div style={{ width: '35px', height: '45px', position: 'relative' }}>
                             {/* Nepal Flag approximation */}
                             <div style={{ width: '100%', height: '100%', clipPath: 'polygon(0% 0%, 100% 40%, 0% 50%, 100% 90%, 0% 100%)', backgroundColor: '#dc2626', border: '2px solid #1d4ed8' }}>
                                <div style={{ position: 'absolute', top: '15%', left: '15%', color: 'white', fontSize: '8px' }}>☀️</div>
                                <div style={{ position: 'absolute', bottom: '15%', left: '15%', color: 'white', fontSize: '8px' }}>🌙</div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* SITE NAME (Yellow Large) */}
                <h1 style={{
                    fontSize: '26px',
                    fontWeight: 900,
                    color: '#fbbf24',
                    marginTop: '15px',
                    textAlign: 'center',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                    margin: '10px 0 2px 0'
                }}>
                    {sName}
                </h1>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'white', textAlign: 'center' }}>
                    राष्ट्रिय समिति
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'white', textAlign: 'center', opacity: 0.9 }}>
                    केन्द्रीय कार्य समिति
                </div>
            </div>

            {/* 2. PROFILE PHOTO SECTION */}
            <div style={{
                marginTop: '-45px',
                zIndex: 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative'
            }}>
                <div style={{
                    width: '160px',
                    height: '185px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '3px',
                    border: '1px solid #ddd',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    {data.image ? (
                        <img 
                            src={getCorsUrl(data.image)} 
                            alt={data.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                            {...(!data.image?.startsWith('blob:') && !data.image?.startsWith('data:') ? { crossOrigin: "anonymous" } : {})}
                        />
                    ) : (
                        <div style={{ width: '100%', height: '100%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            👤
                        </div>
                    )}

                    {/* SIGNATURE OVER PHOTO */}
                    <div style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                        right: '0',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 30
                    }}>
                        <img 
                            src={getCorsUrl(cSignature)} 
                            alt="Signature" 
                            style={{ 
                                height: '60px', 
                                objectFit: 'contain',
                                transform: 'rotate(-5deg)',
                                filter: 'multiply(1.2)'
                            }} 
                        />
                    </div>
                </div>

                <div style={{
                    marginTop: '8px',
                    fontSize: '15px',
                    fontWeight: 800,
                    color: '#000'
                }}>
                    प्रमाणित गर्ने
                </div>
            </div>

            {/* 3. INFO SECTION */}
            <div style={{
                flex: 1,
                padding: '10px 40px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                fontSize: '17px',
                color: '#1e40af', // Blue text for values
                fontWeight: 700,
                marginTop: '15px'
            }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ width: '85px', color: '#1e3a8a', flexShrink: 0 }}>नाम थर :</span>
                    <span>{data.name || 'तपाईंको नाम'}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ width: '85px', color: '#1e3a8a', flexShrink: 0 }}>पद :</span>
                    <span>{getPosition() || 'साधारण सदस्य'}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ width: '85px', color: '#1e3a8a', flexShrink: 0 }}>ठेगाना :</span>
                    <span>{getAddress()}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ width: '85px', color: '#1e3a8a', flexShrink: 0 }}>सम्पर्क नं. :</span>
                    <span>{data.phone || '९८XXXXXXXX'}</span>
                </div>
            </div>

            {/* 4. RED SIDE RIBBON */}
            <div style={{
                position: 'absolute',
                right: '0',
                top: '250px',
                width: '45px',
                height: '180px',
                backgroundColor: '#991b1b', // Dark Red
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderTopLeftRadius: '20px',
                borderBottomLeftRadius: '20px',
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                fontSize: '20px',
                fontWeight: 700,
                letterSpacing: '0.1em'
            }}>
                परिचय पत्र
            </div>

            {/* 5. FOOTER SECTION */}
            <div style={{
                height: '80px',
                width: '100%',
                backgroundColor: 'transparent',
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-end',
                paddingBottom: '12px'
            }}>
                {/* Dark Wave Background */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '60px',
                    backgroundColor: '#1f1105',
                    clipPath: 'polygon(0 40%, 100% 0, 100% 100%, 0 100%)',
                    zIndex: 25
                }} />

                {/* Footer Content */}
                <div style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0 20px',
                    color: 'white',
                    fontSize: '13px',
                    zIndex: 30,
                    fontWeight: 600
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        📞 ०१५२४९५५७
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        🌐 www.whfnepal.org
                    </div>
                </div>
            </div>
        </div>
    );
}
