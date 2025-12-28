import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

// Ensure Cloudinary is configured
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const cursor = searchParams.get('cursor'); // For pagination if needed
        const limit = parseInt(searchParams.get('limit') || '50');

        // Fetch resources from Cloudinary
        // We use the Admin API to list resources
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: 'whf-nepal', // Filter by folder
            max_results: limit,
            next_cursor: cursor || undefined,
            direction: 'desc', // Newest first
        });

        const images = result.resources.map((res: any) => ({
            url: res.secure_url,
            publicId: res.public_id,
            source: 'Cloudinary', // Default source
            date: res.created_at,
            width: res.width,
            height: res.height,
            format: res.format,
        }));

        return NextResponse.json({
            images,
            nextCursor: result.next_cursor,
        });

    } catch (error) {
        console.error("Media GET error:", error);
        return NextResponse.json(
            { error: "Failed to fetch media" },
            { status: 500 }
        );
    }
}
