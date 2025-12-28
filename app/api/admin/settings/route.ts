import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import { getServerSession } from "next-auth"; // If you use next-auth, or however you check auth
// Assuming custom auth or just relying on middleware for /admin routes

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        let settings = await SiteSettings.findOne();

        if (!settings) {
            settings = await SiteSettings.create({});
        }

        return NextResponse.json(settings);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();

        let settings = await SiteSettings.findOne();

        if (!settings) {
            settings = await SiteSettings.create(body);
        } else {
            // Update fields
            if (body.chairmanName !== undefined) settings.chairmanName = body.chairmanName;
            if (body.chairmanTitle !== undefined) settings.chairmanTitle = body.chairmanTitle;
            if (body.chairmanSignature !== undefined) settings.chairmanSignature = body.chairmanSignature;

            await settings.save();
        }

        return NextResponse.json(settings);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
