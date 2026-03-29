import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
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
            if (body.siteName !== undefined) settings.siteName = body.siteName;
            if (body.siteLogo !== undefined) settings.siteLogo = body.siteLogo;
            if (body.chairmanName !== undefined) settings.chairmanName = body.chairmanName;
            if (body.chairmanTitle !== undefined) settings.chairmanTitle = body.chairmanTitle;
            if (body.chairmanSignature !== undefined) settings.chairmanSignature = body.chairmanSignature;
            if (body.regularMembershipFee !== undefined) settings.regularMembershipFee = Number(body.regularMembershipFee);
            if (body.lifetimeMembershipFee !== undefined) settings.lifetimeMembershipFee = Number(body.lifetimeMembershipFee);
            if (body.paymentInstructions !== undefined) settings.paymentInstructions = body.paymentInstructions;

            await settings.save();

            // Revalidate cached paths to reflect branding changes immediately
            revalidatePath('/');
            revalidatePath('/admin');
        }

        return NextResponse.json(settings);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
