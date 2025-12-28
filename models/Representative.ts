import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRepresentative extends Document {
    name: string;
    position: string;
    bio?: string;
    image?: string;
    email?: string;
    phone?: string;
    social: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
        instagram?: string;
    };
    order: number;
    status: 'Active' | 'Inactive';
    createdAt: Date;
    updatedAt: Date;
}

const RepresentativeSchema = new Schema<IRepresentative>(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
        },
        position: {
            type: String,
            required: [true, 'Please provide a position'],
            trim: true,
        },
        bio: {
            type: String,
            trim: true,
        },
        image: {
            type: String,
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        phone: {
            type: String,
            trim: true,
        },
        social: {
            facebook: { type: String, trim: true },
            twitter: { type: String, trim: true },
            linkedin: { type: String, trim: true },
            instagram: { type: String, trim: true },
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
RepresentativeSchema.index({ status: 1, order: 1 });

const Representative: Model<IRepresentative> =
    mongoose.models.Representative || mongoose.model<IRepresentative>('Representative', RepresentativeSchema);

export default Representative;
