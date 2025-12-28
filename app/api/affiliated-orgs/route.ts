import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AffiliatedOrg from '@/models/AffiliatedOrg';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const type = searchParams.get('type');
        const search = searchParams.get('search');

        const filter: any = {};
        if (status) filter.status = status;
        if (type) filter.type = type;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const orgs = await AffiliatedOrg.find(filter)
            .sort({ order: 1, createdAt: -1 })
            .lean();

        return NextResponse.json({ orgs });
    } catch (error) {
        console.error('Affiliated Orgs GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch organizations' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        const org = await AffiliatedOrg.create(body);
        return NextResponse.json({ success: true, org }, { status: 201 });
    } catch (error) {
        console.error('Affiliated Org CREATE error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to create organization' },
            { status: 500 }
        );
    }
}
