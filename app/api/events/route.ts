import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';

// GET /api/events - List all events
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const category = searchParams.get('category');
        const status = searchParams.get('status');
        const published = searchParams.get('published');
        const search = searchParams.get('search');

        const skip = (page - 1) * limit;

        // Build filter
        const filter: any = {};
        if (category) filter.category = category;
        if (status) filter.status = status;
        if (published !== null) filter.published = published === 'true';
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
            ];
        }

        const [events, total] = await Promise.all([
            Event.find(filter)
                .sort({ startDate: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Event.countDocuments(filter),
        ]);

        return NextResponse.json({
            events,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Events GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch events' },
            { status: 500 }
        );
    }
}

// POST /api/events - Create new event
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();

        const event = await Event.create(body);

        return NextResponse.json({ success: true, event }, { status: 201 });
    } catch (error) {
        console.error('Event CREATE error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create event' },
            { status: 500 }
        );
    }
}
