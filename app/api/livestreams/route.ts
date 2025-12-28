import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import LiveStream from '@/models/LiveStream';

// GET - List all live streams
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const isActive = searchParams.get('isActive');

        const query: any = {};
        if (status) query.status = status;
        if (isActive !== null) query.isActive = isActive === 'true';

        const liveStreams = await LiveStream.find(query)
            .sort({ status: 1, scheduledAt: -1, createdAt: -1 })
            .lean();

        return NextResponse.json(liveStreams);
    } catch (error: any) {
        console.error('Error fetching live streams:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch live streams' },
            { status: 500 }
        );
    }
}

// POST - Create new live stream
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const liveStream = await LiveStream.create(body);

        return NextResponse.json(liveStream, { status: 201 });
    } catch (error: any) {
        console.error('Error creating live stream:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create live stream' },
            { status: 500 }
        );
    }
}
