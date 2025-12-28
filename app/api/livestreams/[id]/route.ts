import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import LiveStream from '@/models/LiveStream';

// GET - Single live stream
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const liveStream = await LiveStream.findById(id).lean();

        if (!liveStream) {
            return NextResponse.json(
                { error: 'Live stream not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(liveStream);
    } catch (error: any) {
        console.error('Error fetching live stream:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch live stream' },
            { status: 500 }
        );
    }
}

// PUT - Update live stream
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();

        const liveStream = await LiveStream.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!liveStream) {
            return NextResponse.json(
                { error: 'Live stream not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(liveStream);
    } catch (error: any) {
        console.error('Error updating live stream:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update live stream' },
            { status: 500 }
        );
    }
}

// DELETE - Delete live stream
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const liveStream = await LiveStream.findByIdAndDelete(id);

        if (!liveStream) {
            return NextResponse.json(
                { error: 'Live stream not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Live stream deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting live stream:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete live stream' },
            { status: 500 }
        );
    }
}
