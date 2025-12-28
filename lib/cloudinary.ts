import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

/**
 * Upload an image to Cloudinary
 * @param file - File path or base64 string
 * @param folder - Cloudinary folder name (optional)
 * @returns Cloudinary upload result
 */
export async function uploadImage(file: string, folder: string = 'whf-nepal') {
    // Validate Cloudinary credentials
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET) {
        return {
            success: false,
            error: 'Cloudinary credentials not configured. Please add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env.local file.',
        };
    }

    try {
        const result = await cloudinary.uploader.upload(file, {
            folder: folder,
            resource_type: 'auto',
            transformation: [
                { width: 1200, height: 1200, crop: 'limit' },
                { quality: 'auto:good' },
                { fetch_format: 'auto' },
            ],
        });

        return {
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Upload failed',
        };
    }
}

/**
 * Delete an image from Cloudinary
 * @param publicId - Cloudinary public ID
 * @returns Delete result
 */
export async function deleteImage(publicId: string) {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return { success: result.result === 'ok' };
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        return { success: false, error: 'Delete failed' };
    }
}
