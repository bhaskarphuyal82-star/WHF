import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// GET - List all members (admin only)
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const search = searchParams.get('search');

        // Only show users with member role (excludes admin/super_admin)
        const query: any = { role: 'member' };
        if (status) query.membershipStatus = status;

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { name: searchRegex },
                { email: searchRegex },
                { phone: searchRegex },
                { 'address.district': searchRegex },
                { 'address.municipality': searchRegex }
            ];
        }

        const skip = (page - 1) * limit;

        const [members, total] = await Promise.all([
            User.find(query)
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            User.countDocuments(query),
        ]);

        return NextResponse.json({
            members,
            total,
            page,
            pages: Math.ceil(total / limit),
        });
    } catch (error: any) {
        console.error('Error fetching members:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch members' },
            { status: 500 }
        );
    }
}
