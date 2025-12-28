import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Video from '@/models/Video';
import mongoose from 'mongoose';

// GET /api/videos/[id] - Get single video
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid video ID' }, { status: 400 });
        }

        const video = await Video.findById(id);

        if (!video) {
            return NextResponse.json({ error: 'Video not found' }, { status: 404 });
        }

        return NextResponse.json({ video });
    } catch (error) {
        console.error('Video GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch video' },
            { status: 500 }
        );
    }
}

// PUT /api/videos/[id] - Update video
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;
        const body = await request.json();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid video ID' }, { status: 400 });
        }

        const video = await Video.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!video) {
            return NextResponse.json({ error: 'Video not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, video });
    } catch (error) {
        console.error('Video UPDATE error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to update video' },
            { status: 500 }
        );
    }
}

// DELETE /api/videos/[id] - Delete video
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid video ID' }, { status: 400 });
        }

        const video = await Video.findByIdAndDelete(id);

        if (!video) {
            return NextResponse.json({ error: 'Video not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Video deleted' });
    } catch (error) {
        console.error('Video DELETE error:', error);
        return NextResponse.json(
            { error: 'Failed to delete video' },
            { status: 500 }
        );
    }
}
