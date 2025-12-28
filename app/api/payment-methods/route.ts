import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PaymentMethod from "@/models/PaymentMethod";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
    try {
        await connectDB();
        const methods = await PaymentMethod.find();
        return NextResponse.json(methods);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch payment methods" },
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
        const { type } = body;

        if (!type) {
            return NextResponse.json(
                { error: "Type is required" },
                { status: 400 }
            );
        }

        // Upsert: Update if exists, create if not
        const method = await PaymentMethod.findOneAndUpdate(
            { type },
            { ...body },
            { new: true, upsert: true, runValidators: true }
        );

        return NextResponse.json(method);
    } catch (error: any) {
        // Handle unique constraint error specifically if needed, though findOneAndUpdate with upsert handles it
        return NextResponse.json(
            { error: error.message || "Failed to update payment method" },
            { status: 500 }
        );
    }
}
