import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function GET(request: NextRequest) {
    try {
        // Security check - only allow in development
        if (process.env.NODE_ENV === 'production') {
            return NextResponse.json(
                { error: 'This endpoint is disabled in production for security' },
                { status: 403 }
            );
        }

        await connectDB();

        // Get all admins (without passwords)
        const admins = await Admin.find({}).select('-password');

        return NextResponse.json({
            success: true,
            count: admins.length,
            data: admins
        });

    } catch (error) {
        console.error('Error fetching admins:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch admins',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
