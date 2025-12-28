import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Slider from '@/models/Slider';
import mongoose from 'mongoose';

// GET /api/sliders/[id] - Get single slider
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid slider ID' }, { status: 400 });
        }

        const slider = await Slider.findById(id);

        if (!slider) {
            return NextResponse.json({ error: 'Slider not found' }, { status: 404 });
        }

        return NextResponse.json({ slider });
    } catch (error) {
        console.error('Slider GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch slider' },
            { status: 500 }
        );
    }
}

// PUT /api/sliders/[id] - Update slider
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid slider ID' }, { status: 400 });
        }

        const slider = await Slider.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!slider) {
            return NextResponse.json({ error: 'Slider not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, slider });
    } catch (error) {
        console.error('Slider UPDATE error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to update slider' },
            { status: 500 }
        );
    }
}

// DELETE /api/sliders/[id] - Delete slider
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid slider ID' }, { status: 400 });
        }

        const slider = await Slider.findByIdAndDelete(id);

        if (!slider) {
            return NextResponse.json({ error: 'Slider not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Slider deleted' });
    } catch (error) {
        console.error('Slider DELETE error:', error);
        return NextResponse.json(
            { error: 'Failed to delete slider' },
            { status: 500 }
        );
    }
}
