import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import Counter from './Counter';

export interface IAddress {
    province: string;
    district: string;
    municipality: string;
    ward: string;
    tole?: string;
}

export interface IUser extends Document {
    memberId?: string; // e.g. WHF-1001
    name: string;
    email: string;
    phone?: string;
    password: string;
    role: 'user' | 'member' | 'admin';
    image?: string;
    address?: IAddress;
    membershipStatus: 'Pending' | 'Approved' | 'Rejected';
    membershipDate?: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const AddressSchema = new Schema<IAddress>(
    {
        province: { type: String, trim: true },
        district: { type: String, trim: true },
        municipality: { type: String, trim: true },
        ward: { type: String, trim: true },
        tole: { type: String, trim: true },
    },
    { _id: false }
);

const UserSchema = new Schema<IUser>(
    {
        memberId: {
            type: String,
            unique: true,
            sparse: true,
        },
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        phone: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false,
        },
        role: {
            type: String,
            enum: ['user', 'member', 'admin'],
            default: 'member',
        },
        image: {
            type: String,
            default: null,
        },
        address: {
            type: AddressSchema,
            default: null,
        },
        membershipStatus: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending',
        },
        membershipDate: {
            type: Date,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Pre-save hook to generate memberId
// Pre-save hook to generate memberId
UserSchema.pre('save', async function () {
    // 1. Hash password if modified
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    // 2. Generate memberId if it doesn't exist AND the user is a 'member'
    // We only generate for 'member' role to avoid ID burn for simple users if any
    if (!this.memberId && this.role === 'member') {
        try {
            const counter = await Counter.findByIdAndUpdate(
                'memberId',
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );

            if (counter) {
                // Determine format:
                // Start from 1001 for the first member
                const nextSeq = 1000 + counter.seq;
                this.memberId = `WHF-${nextSeq}`;
            }
        } catch (error: any) {
            throw error;
        }
    }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// Indexes
UserSchema.index({ membershipStatus: 1 });
UserSchema.index({ role: 1 });


const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
