import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

        // Upload to Cloudinary
        const result = await uploadImage(base64, 'whf-nepal');

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || 'Upload failed' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            url: result.url,
            publicId: result.publicId,
            width: result.width,
            height: result.height,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Upload failed' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Upload endpoint - Use POST with multipart/form-data',
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'Not configured',
    });
}
