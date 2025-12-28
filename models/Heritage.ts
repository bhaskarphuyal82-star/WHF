import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHeritage extends Document {
    title: string;
    description?: string;
    location?: string;
    image?: string;
    status: 'Active' | 'Inactive';
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const HeritageSchema = new Schema<IHeritage>(
    {
        title: {
            type: String,
            required: [true, 'Please provide a title'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        location: {
            type: String,
            trim: true,
        },
        image: {
            type: String,
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active',
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
HeritageSchema.index({ status: 1, order: 1 });

const Heritage: Model<IHeritage> =
    mongoose.models.Heritage || mongoose.model<IHeritage>('Heritage', HeritageSchema);

export default Heritage;
