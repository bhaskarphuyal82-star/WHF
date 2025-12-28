import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISlider extends Document {
    title: string;
    subtitle?: string;
    image: string;
    link?: string;
    order: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const SliderSchema = new Schema<ISlider>(
    {
        title: {
            type: String,
            required: [true, 'Please provide a title'],
            trim: true,
        },
        subtitle: {
            type: String,
            trim: true,
        },
        image: {
            type: String,
            required: [true, 'Please provide an image URL'],
        },
        link: {
            type: String,
            trim: true,
        },
        order: {
            type: Number,
            default: 0,
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
SliderSchema.index({ active: 1, order: 1 });

const Slider: Model<ISlider> = mongoose.models.Slider || mongoose.model<ISlider>('Slider', SliderSchema);

export default Slider;
