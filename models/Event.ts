import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEvent extends Document {
    title: string;
    slug: string;
    description: string;
    startDate: Date;
    endDate?: Date;
    location: string;
    venue?: string;
    featuredImage?: string;
    images: string[];
    registrationRequired: boolean;
    maxAttendees?: number;
    currentAttendees: number;
    category: 'Festival' | 'Workshop' | 'Meeting' | 'Ceremony' | 'Other';
    status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
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
        description: {
            type: String,
            required: [true, 'Please provide a description'],
        },
        startDate: {
            type: Date,
            required: [true, 'Please provide a start date'],
        },
        endDate: {
            type: Date,
        },
        location: {
            type: String,
            required: [true, 'Please provide a location'],
            trim: true,
        },
        venue: {
            type: String,
            trim: true,
        },
        featuredImage: {
            type: String,
        },
        images: [{
            type: String,
        }],
        registrationRequired: {
            type: Boolean,
            default: false,
        },
        maxAttendees: {
            type: Number,
            min: 0,
        },
        currentAttendees: {
            type: Number,
            default: 0,
            min: 0,
        },
        category: {
            type: String,
            enum: ['Festival', 'Workshop', 'Meeting', 'Ceremony', 'Other'],
            default: 'Other',
        },
        status: {
            type: String,
            enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
            default: 'Upcoming',
        },
        published: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Generate slug from title before saving
EventSchema.pre('save', function () {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
});

// Indexes
// EventSchema.index({ slug: 1 }); // Already indexed by unique: true
EventSchema.index({ published: 1, startDate: -1 });
EventSchema.index({ status: 1 });
EventSchema.index({ category: 1 });

const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;
