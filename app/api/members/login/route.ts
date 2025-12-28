import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// POST - Member login
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const { email, password } = await request.json();

        // Find user with password
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            return NextResponse.json(
                { error: 'इमेल वा पासवर्ड गलत छ' },
                { status: 401 }
            );
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return NextResponse.json(
                { error: 'इमेल वा पासवर्ड गलत छ' },
                { status: 401 }
            );
        }

        // Check if account is active
        if (!user.isActive) {
            return NextResponse.json(
                { error: 'तपाईंको खाता निष्क्रिय गरिएको छ' },
                { status: 403 }
            );
        }

        // Check membership status - only approved members can login
        if (user.membershipStatus === 'Pending') {
            return NextResponse.json(
                { error: 'तपाईंको सदस्यता अझै स्वीकृत भएको छैन। कृपया प्रतीक्षा गर्नुहोस्।' },
                { status: 403 }
            );
        }

        if (user.membershipStatus === 'Rejected') {
            return NextResponse.json(
                { error: 'तपाईंको सदस्यता आवेदन अस्वीकार गरिएको छ।' },
                { status: 403 }
            );
        }

        // Allow login if status is Approved OR if no status is set (for existing members)
        // Members without membershipStatus are treated as approved for backwards compatibility

        // Create JWT token
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Create response with cookie
        const response = NextResponse.json({
            message: 'लगइन सफल भयो',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                membershipStatus: user.membershipStatus,
            },
        });

        // Set cookie
        response.cookies.set('member_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: error.message || 'लगइन गर्न असफल भयो' },
            { status: 500 }
        );
    }
}
