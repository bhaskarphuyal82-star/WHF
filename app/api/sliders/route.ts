import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Slider from '@/models/Slider';

// GET /api/sliders - Get all active sliders (public) or all (admin - via query param)
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const isAdmin = searchParams.get('admin') === 'true';

        const query = isAdmin ? {} : { active: true };
        const sort: { [key: string]: 'asc' | 'desc' } = { order: 'asc' }; // Default sort by order

        const sliders = await Slider.find(query).sort(sort);

        return NextResponse.json({ sliders });
    } catch (error) {
        console.error('Sliders GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch sliders' },
            { status: 500 }
        );
    }
}

// POST /api/sliders - Create new slider
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();

        // Basic validation
        if (!body.image || !body.title) {
            return NextResponse.json(
                { error: 'Title and Image are required' },
                { status: 400 }
            );
        }

        const slider = await Slider.create(body);

        return NextResponse.json({ success: true, slider }, { status: 201 });
    } catch (error) {
        console.error('Slider POST error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create slider' },
            { status: 500 }
        );
    }
}
