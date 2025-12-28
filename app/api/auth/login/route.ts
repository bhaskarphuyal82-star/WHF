import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { generateToken, createTokenCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const { email, password } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const emailLower = email.toLowerCase();

        // Only check Admin collection for admin login
        const admin = await Admin.findOne({ email: emailLower });

        if (!admin) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const isPasswordValid = await admin.comparePassword(password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const authenticatedUser = admin;

        // Generate JWT token
        const token = generateToken({
            userId: authenticatedUser._id.toString(),
            email: authenticatedUser.email,
            role: authenticatedUser.role,
        });

        // Create response with cookie
        const response = NextResponse.json(
            {
                success: true,
                user: {
                    id: authenticatedUser._id,
                    email: authenticatedUser.email,
                    name: authenticatedUser.name,
                    role: authenticatedUser.role,
                },
            },
            { status: 200 }
        );

        // Set HTTP-only cookie
        response.headers.set('Set-Cookie', createTokenCookie(token));

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
