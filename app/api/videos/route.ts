import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Video from '@/models/Video';

// GET /api/videos - List all videos
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

        const [videos, total] = await Promise.all([
            Video.find(filter)
                .sort({ publishedAt: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Video.countDocuments(filter),
        ]);

        return NextResponse.json({
            videos,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Videos GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch videos' },
            { status: 500 }
        );
    }
}

// POST /api/videos - Create new video
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();

        const video = await Video.create(body);

        return NextResponse.json({ success: true, video }, { status: 201 });
    } catch (error) {
        console.error('Video CREATE error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create video' },
            { status: 500 }
        );
    }
}
