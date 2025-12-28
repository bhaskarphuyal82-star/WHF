import mongoose, { Schema, Document, Model } from 'mongoose';

interface IGalleryImage {
    url: string;
    caption?: string;
    order: number;
}

export interface IGallery extends Document {
    title: string;
    description?: string;
    coverImage?: string;
    images: IGalleryImage[];
    category?: string;
    eventDate?: Date;
    published: boolean;
    views: number;
    createdAt: Date;
    updatedAt: Date;
}

const GalleryImageSchema = new Schema({
    url: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
        trim: true,
    },
    order: {
        type: Number,
        default: 0,
    },
}, { _id: false });

const GallerySchema = new Schema<IGallery>(
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
        coverImage: {
            type: String,
        },
        images: [GalleryImageSchema],
        category: {
            type: String,
            trim: true,
        },
        eventDate: {
            type: Date,
        },
        published: {
            type: Boolean,
            default: false,
        },
        views: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
GallerySchema.index({ published: 1, createdAt: -1 });
GallerySchema.index({ category: 1 });
GallerySchema.index({ eventDate: -1 });

const Gallery: Model<IGallery> = mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);

export default Gallery;
