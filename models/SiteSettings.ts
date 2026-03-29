import mongoose from 'mongoose';

const SiteSettingsSchema = new mongoose.Schema({
    siteName: {
        type: String,
        default: 'विश्व हिन्दु महासंघ नेपाल'
    },
    siteLogo: {
        type: String,
        default: '/whf-logo.png'
    },
    chairmanName: {
        type: String,
        default: 'डा. रामचन्द्र अधिकारी'
    },
    chairmanTitle: {
        type: String,
        default: 'अध्यक्ष'
    },
    chairmanSignature: {
        type: String,
        default: '/signature.png'
    },
    regularMembershipFee: {
        type: Number,
        default: 500
    },
    lifetimeMembershipFee: {
        type: Number,
        default: 2501
    },
    paymentInstructions: {
        type: String,
        default: 'कृपया निम्न बैंक खातामा रकम जम्मा गरी भौचर वा ट्रान्जेक्सन आईडी यहाँ अपलोड गर्नुहोस्।'
    }
}, { timestamps: true });

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
