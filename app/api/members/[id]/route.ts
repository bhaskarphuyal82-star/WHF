import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// GET - Single member details
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const member = await User.findById(id).select('-password').lean();

        if (!member) {
            return NextResponse.json(
                { error: 'Member not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(member);
    } catch (error: any) {
        console.error('Error fetching member:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch member' },
            { status: 500 }
        );
    }
}

// PUT - Update member (admin)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();

        // If approving membership, set the date
        if (body.membershipStatus === 'Approved') {
            body.membershipDate = new Date();
        }

        const member = await User.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        ).select('-password');

        if (!member) {
            return NextResponse.json(
                { error: 'Member not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(member);
    } catch (error: any) {
        console.error('Error updating member:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update member' },
            { status: 500 }
        );
    }
}

// DELETE - Delete member
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const member = await User.findByIdAndDelete(id);

        if (!member) {
            return NextResponse.json(
                { error: 'Member not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Member deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting member:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete member' },
            { status: 500 }
        );
    }
}
