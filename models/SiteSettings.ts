import mongoose from 'mongoose';

const SiteSettingsSchema = new mongoose.Schema({
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
    }
}, { timestamps: true });

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
