import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function POST(request: NextRequest) {
    try {
        // Security check - only allow in development
        if (process.env.NODE_ENV === 'production') {
            return NextResponse.json(
                { error: 'This endpoint is disabled in production for security' },
                { status: 403 }
            );
        }

        await connectDB();

        // Get admin data from request body
        const body = await request.json();
        const {
            email = 'admin@whfnepal.org',
            password = 'Admin@123',
            name = 'WHF Nepal Admin',
            role = 'super_admin'
        } = body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            return NextResponse.json(
                {
                    error: 'Admin user already exists',
                    message: `An admin with email ${email} already exists in the database`
                },
                { status: 409 }
            );
        }

        // Create new admin
        const admin = new Admin({
            email,
            password,
            name,
            role
        });

        await admin.save();

        return NextResponse.json({
            success: true,
            message: 'Admin user created successfully',
            data: {
                email: admin.email,
                name: admin.name,
                role: admin.role,
                createdAt: admin.createdAt
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating admin:', error);
        return NextResponse.json(
            {
                error: 'Failed to create admin user',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
