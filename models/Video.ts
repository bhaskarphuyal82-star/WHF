import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVideo extends Document {
    title: string;
    description?: string;
    videoUrl: string;
    thumbnail?: string;
    duration?: string;
    category: 'Documentary' | 'Event' | 'Tutorial' | 'Interview' | 'Other';
    tags: string[];
    views: number;
    published: boolean;
    publishedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>(
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
        videoUrl: {
            type: String,
            required: [true, 'Please provide a video URL'],
            trim: true,
        },
        thumbnail: {
            type: String,
        },
        duration: {
            type: String,
            trim: true,
        },
        category: {
            type: String,
            enum: ['Documentary', 'Event', 'Tutorial', 'Interview', 'Other'],
            default: 'Other',
        },
        tags: [{
            type: String,
            trim: true,
        }],
        views: {
            type: Number,
            default: 0,
        },
        published: {
            type: Boolean,
            default: false,
        },
        publishedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Set publishedAt when published changes to true
VideoSchema.pre('save', function () {
    if (this.isModified('published') && this.published && !this.publishedAt) {
        this.publishedAt = new Date();
    }
});

// Indexes
VideoSchema.index({ published: 1, publishedAt: -1 });
VideoSchema.index({ category: 1 });
VideoSchema.index({ tags: 1 });

const Video: Model<IVideo> = mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);

export default Video;
