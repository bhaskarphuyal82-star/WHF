import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAffiliatedOrg extends Document {
    name: string;
    description?: string;
    logo?: string;
    website?: string;
    location?: string;
    establishedYear?: number;
    type: 'National' | 'International' | 'Regional';
    order: number;
    status: 'Active' | 'Inactive';
    createdAt: Date;
    updatedAt: Date;
}

const AffiliatedOrgSchema = new Schema<IAffiliatedOrg>(
    {
        name: {
            type: String,
            required: [true, 'Please provide organization name'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        logo: {
            type: String,
        },
        website: {
            type: String,
            trim: true,
        },
        location: {
            type: String,
            trim: true,
        },
        establishedYear: {
            type: Number,
        },
        type: {
            type: String,
            enum: ['National', 'International', 'Regional'],
            default: 'National',
        },
        order: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active',
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
AffiliatedOrgSchema.index({ status: 1, order: 1 });
AffiliatedOrgSchema.index({ type: 1 });

const AffiliatedOrg: Model<IAffiliatedOrg> =
    mongoose.models.AffiliatedOrg || mongoose.model<IAffiliatedOrg>('AffiliatedOrg', AffiliatedOrgSchema);

export default AffiliatedOrg;
