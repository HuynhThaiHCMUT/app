import { NextRequest, NextResponse } from 'next/server';
import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id") ?? "";
    
    const res = await cloudinary.uploader.destroy(id);

    return NextResponse.json(res);
}