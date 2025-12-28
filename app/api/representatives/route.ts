import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Representative from '@/models/Representative';

// GET /api/representatives - List all representatives
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        // Build filter
        const filter: any = {};
        if (status) filter.status = status;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { position: { $regex: search, $options: 'i' } },
            ];
        }

        const representatives = await Representative.find(filter)
            .sort({ order: 1, createdAt: -1 })
            .lean();

        return NextResponse.json({ representatives });
    } catch (error) {
        console.error('Representatives GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch representatives' },
            { status: 500 }
        );
    }
}

// POST /api/representatives - Create new representative
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();

        const representative = await Representative.create(body);

        return NextResponse.json({ success: true, representative }, { status: 201 });
    } catch (error) {
        console.error('Representative CREATE error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create representative' },
            { status: 500 }
        );
    }
}
