import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function GET() {
    try {
        await connectDB();

        // Check if any admin exists
        const existingAdmin = await Admin.findOne();
        if (existingAdmin) {
            return NextResponse.json(
                { message: 'Admin user already exists' },
                { status: 200 }
            );
        }

        // Create default admin
        const admin = await Admin.create({
            email: 'admin@whfnepal.org',
            password: 'Admin@123', // Will be hashed by the pre-save hook
            name: 'Admin User',
            role: 'super_admin',
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Default admin user created successfully',
                user: {
                    email: admin.email,
                    name: admin.name,
                    role: admin.role,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Seed admin error:', error);
        return NextResponse.json(
            { error: 'Failed to create admin user' },
            { status: 500 }
        );
    }
}
