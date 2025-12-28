import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Gallery from '@/models/Gallery';
import mongoose from 'mongoose';

// GET /api/gallery/[id] - Get single gallery
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid gallery ID' }, { status: 400 });
        }

        const gallery = await Gallery.findById(id);

        if (!gallery) {
            return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });
        }

        return NextResponse.json({ gallery });
    } catch (error) {
        console.error('Gallery GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch gallery' },
            { status: 500 }
        );
    }
}

// PUT /api/gallery/[id] - Update gallery
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;
        const body = await request.json();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid gallery ID' }, { status: 400 });
        }

        const gallery = await Gallery.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!gallery) {
            return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, gallery });
    } catch (error) {
        console.error('Gallery UPDATE error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to update gallery' },
            { status: 500 }
        );
    }
}

// DELETE /api/gallery/[id] - Delete gallery
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid gallery ID' }, { status: 400 });
        }

        const gallery = await Gallery.findByIdAndDelete(id);

        if (!gallery) {
            return NextResponse.json({ error: 'Gallery not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Gallery deleted' });
    } catch (error) {
        console.error('Gallery DELETE error:', error);
        return NextResponse.json(
            { error: 'Failed to delete gallery' },
            { status: 500 }
        );
    }
}
