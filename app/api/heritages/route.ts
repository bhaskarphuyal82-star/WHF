import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Heritage from "@/models/Heritage";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
    try {
        await connectDB();
        const heritages = await Heritage.find().sort({ order: 1 });
        return NextResponse.json(heritages);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch heritages" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const payload = verifyAuth(req);
        if (!payload) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const body = await req.json();
        const heritage = await Heritage.create(body);

        return NextResponse.json(heritage, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create heritage" },
            { status: 500 }
        );
    }
}
