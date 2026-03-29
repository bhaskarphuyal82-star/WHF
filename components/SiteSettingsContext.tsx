"use client";

import React, { createContext, useContext, ReactNode } from "react";

interface SiteSettings {
    siteName: string;
    siteLogo: string;
    chairmanName?: string;
    chairmanTitle?: string;
    chairmanSignature?: string;
}

interface SiteSettingsContextType {
    settings: SiteSettings;
}

const defaultSettings: SiteSettings = {
    siteName: "विश्व हिन्दु महासंघ नेपाल",
    siteLogo: "/whf-logo.png",
};

const SiteSettingsContext = createContext<SiteSettingsContextType>({ settings: defaultSettings });

export function SiteSettingsProvider({ 
    children, 
    initialSettings 
}: { 
    children: ReactNode; 
    initialSettings?: Partial<SiteSettings> 
}) {
    // Merge settings carefully to ignore empty strings/nulls from DB
    const mergedSettings = { ...defaultSettings };
    
    if (initialSettings) {
        if (initialSettings.siteName) mergedSettings.siteName = initialSettings.siteName;
        if (initialSettings.siteLogo) mergedSettings.siteLogo = initialSettings.siteLogo;
        if (initialSettings.chairmanName) mergedSettings.chairmanName = initialSettings.chairmanName;
        if (initialSettings.chairmanTitle) mergedSettings.chairmanTitle = initialSettings.chairmanTitle;
        if (initialSettings.chairmanSignature) mergedSettings.chairmanSignature = initialSettings.chairmanSignature;
    }

    return (
        <SiteSettingsContext.Provider value={{ settings: mergedSettings }}>
            {children}
        </SiteSettingsContext.Provider>
    );
}

export const useSiteSettings = () => useContext(SiteSettingsContext);
