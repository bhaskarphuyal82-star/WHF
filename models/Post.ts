import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPost extends Document {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    featuredImage?: string;
    images: string[];
    author: mongoose.Types.ObjectId;
    category: 'News' | 'Blog' | 'Announcement';
    tags: string[];
    published: boolean;
    publishedAt?: Date;
    views: number;
    createdAt: Date;
    updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
    {
        title: {
            type: String,
            required: [true, 'Please provide a title'],
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'Please provide content'],
        },
        excerpt: {
            type: String,
            maxlength: [300, 'Excerpt should not exceed 300 characters'],
        },
        featuredImage: {
            type: String,
        },
        images: [{
            type: String,
        }],
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        category: {
            type: String,
            enum: ['News', 'Blog', 'Announcement'],
            default: 'Blog',
        },
        tags: [{
            type: String,
            trim: true,
        }],
        published: {
            type: Boolean,
            default: false,
        },
        publishedAt: {
            type: Date,
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

// Generate slug from title before saving
PostSchema.pre('save', function () {
    if (!this.slug || this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }

    // Set publishedAt when published changes to true
    if (this.isModified('published') && this.published && !this.publishedAt) {
        this.publishedAt = new Date();
    }
});

// Indexes
// PostSchema.index({ slug: 1 }); // Already indexed by unique: true
PostSchema.index({ published: 1, publishedAt: -1 });
PostSchema.index({ category: 1 });
PostSchema.index({ tags: 1 });

const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;
