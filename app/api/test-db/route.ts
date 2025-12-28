import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
    try {
        // Connect to MongoDB
        await connectDB();

        // Test query - count users
        const userCount = await User.countDocuments();

        // Get connection state
        const dbState = {
            connected: true,
            userCount: userCount,
            message: 'MongoDB connection successful!',
            timestamp: new Date().toISOString(),
        };

        return NextResponse.json(dbState, { status: 200 });
    } catch (error) {
        console.error('Database connection test failed:', error);
        return NextResponse.json(
            {
                connected: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                message: 'MongoDB connection failed',
            },
            { status: 500 }
        );
    }
}
