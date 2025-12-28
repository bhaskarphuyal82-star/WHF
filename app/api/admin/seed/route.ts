import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        // Simple security check using a query parameter
        // Usage: /api/admin/seed?secret=whf_admin_setup
        const { searchParams } = new URL(request.url);
        const secret = searchParams.get('secret');

        if (secret !== 'whf_admin_setup') {
            return NextResponse.json(
                { error: 'Unauthorized. Please provide the correct secret key.' },
                { status: 403 }
            );
        }

        const email = 'admin@whfnepal.org';
        const password = 'Admin@123';
        const name = 'WHF Nepal Admin';
        const role = 'super_admin';

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            return NextResponse.json(
                {
                    error: 'Admin user already exists',
                    message: `An admin with email ${email} already exists.`
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
            credentials: {
                email,
                password
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
