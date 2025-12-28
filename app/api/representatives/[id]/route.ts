import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Representative from '@/models/Representative';
import mongoose from 'mongoose';

// GET /api/representatives/[id] - Get single representative
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid representative ID' }, { status: 400 });
        }

        const representative = await Representative.findById(id);

        if (!representative) {
            return NextResponse.json({ error: 'Representative not found' }, { status: 404 });
        }

        return NextResponse.json({ representative });
    } catch (error) {
        console.error('Representative GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch representative' },
            { status: 500 }
        );
    }
}

// PUT /api/representatives/[id] - Update representative
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;
        const body = await request.json();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid representative ID' }, { status: 400 });
        }

        const representative = await Representative.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!representative) {
            return NextResponse.json({ error: 'Representative not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, representative });
    } catch (error) {
        console.error('Representative UPDATE error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to update representative' },
            { status: 500 }
        );
    }
}

// DELETE /api/representatives/[id] - Delete representative
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid representative ID' }, { status: 400 });
        }

        const representative = await Representative.findByIdAndDelete(id);

        if (!representative) {
            return NextResponse.json({ error: 'Representative not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Representative deleted' });
    } catch (error) {
        console.error('Representative DELETE error:', error);
        return NextResponse.json(
            { error: 'Failed to delete representative' },
            { status: 500 }
        );
    }
}
