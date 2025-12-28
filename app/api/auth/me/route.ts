import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        // Verify authentication
        const tokenPayload = verifyAuth(request);
        if (!tokenPayload) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        // Fetch admin from database
        const admin = await Admin.findById(tokenPayload.userId).select('-password');
        if (!admin) {
            return NextResponse.json(
                { error: 'Admin not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                user: {
                    id: admin._id,
                    email: admin.email,
                    name: admin.name,
                    role: admin.role,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get current user error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
