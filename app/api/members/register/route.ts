import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// POST - Register new member
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { name, email, phone, password, address, image } = body;

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { error: 'यो इमेल पहिले नै दर्ता भइसकेको छ' },
                { status: 400 }
            );
        }

        // Create new member
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            phone,
            password,
            address,
            image,
            role: 'member',
            membershipStatus: 'Pending',
        });

        return NextResponse.json(
            {
                message: 'दर्ता सफल भयो! तपाईंको आवेदन समीक्षा अधीनमा छ।',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    membershipStatus: user.membershipStatus,
                },
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: error.message || 'दर्ता गर्न असफल भयो' },
            { status: 500 }
        );
    }
}
