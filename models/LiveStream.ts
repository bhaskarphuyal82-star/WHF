import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILiveStream extends Document {
    title: string;
    description?: string;
    streamUrl: string;
    location: string;
    thumbnail?: string;
    status: 'Live' | 'Scheduled' | 'Ended';
    scheduledAt?: Date;
    isActive: boolean;
    views: number;
    createdAt: Date;
    updatedAt: Date;
}

const LiveStreamSchema = new Schema<ILiveStream>(
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
        streamUrl: {
            type: String,
            required: [true, 'Please provide a stream URL'],
            trim: true,
        },
        location: {
            type: String,
            required: [true, 'Please provide a location'],
            trim: true,
        },
        thumbnail: {
            type: String,
        },
        status: {
            type: String,
            enum: ['Live', 'Scheduled', 'Ended'],
            default: 'Scheduled',
        },
        scheduledAt: {
            type: Date,
        },
        isActive: {
            type: Boolean,
            default: true,
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
LiveStreamSchema.index({ status: 1, isActive: 1 });
LiveStreamSchema.index({ scheduledAt: 1 });

const LiveStream: Model<ILiveStream> =
    mongoose.models.LiveStream || mongoose.model<ILiveStream>('LiveStream', LiveStreamSchema);

export default LiveStream;
