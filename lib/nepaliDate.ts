import NepaliDate from 'nepali-date-converter';

// Map of English months to Nepali names for better localization if needed, 
// though the library handles formatting. 
// We will focus on a standard readable format like "YYYY Month DD" -> "२०८१ बैशाख १२" if possible or "2081-01-12"
// The library supports format strings.

export const formatToNepaliDate = (dateInput: string | Date, formatStr: string = 'YYYY-MM-DD'): string => {
    if (!dateInput) return '';
    try {
        const date = new Date(dateInput);
        const nepaliDate = new NepaliDate(date);
        return nepaliDate.format(formatStr);
    } catch (e) {
        console.error("Error converting date to Nepali:", e);
        return String(dateInput);
    }
};

export const formatToNepaliTime = (dateInput: string | Date): string => {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    return date.toLocaleTimeString('ne-NP', { hour: '2-digit', minute: '2-digit' });
}

export const formatToNepaliDateTime = (dateInput: string | Date): string => {
    return `${formatToNepaliDate(dateInput, 'YYYY-MM-DD')} ${formatToNepaliTime(dateInput)}`;
}
