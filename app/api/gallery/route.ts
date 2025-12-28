import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Gallery from '@/models/Gallery';

// GET /api/gallery - List all galleries
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const category = searchParams.get('category');
        const published = searchParams.get('published');
        const search = searchParams.get('search');

        const skip = (page - 1) * limit;

        // Build filter
        const filter: any = {};
        if (category) filter.category = category;
        if (published !== null) filter.published = published === 'true';
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const [galleries, total] = await Promise.all([
            Gallery.find(filter)
                .sort({ eventDate: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Gallery.countDocuments(filter),
        ]);

        return NextResponse.json({
            galleries,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Gallery GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch galleries' },
            { status: 500 }
        );
    }
}

// POST /api/gallery - Create new gallery
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();

        const gallery = await Gallery.create(body);

        return NextResponse.json({ success: true, gallery }, { status: 201 });
    } catch (error) {
        console.error('Gallery CREATE error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create gallery' },
            { status: 500 }
        );
    }
}
