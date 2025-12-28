import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// GET - Get current member data
export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('member_token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

        await connectDB();

        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Lazy generation of memberId if missing and user is a member
        if (!user.memberId && user.role === 'member') {
            await user.save();
        }

        return NextResponse.json(user);
    } catch (error: any) {
        console.error('Error fetching member:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 401 }
        );
    }
}

// PUT - Update current member profile
export async function PUT(request: NextRequest) {
    try {
        const token = request.cookies.get('member_token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        const body = await request.json();

        await connectDB();

        // Only allow updating specific fields
        const allowedFields = ['name', 'phone', 'image', 'address'];
        const updateData: any = {};

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updateData[field] = body[field];
            }
        }

        const user = await User.findByIdAndUpdate(
            decoded.id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error: any) {
        console.error('Error updating member:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update profile' },
            { status: 500 }
        );
    }
}
