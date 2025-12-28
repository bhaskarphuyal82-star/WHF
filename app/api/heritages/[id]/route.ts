import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Heritage from "@/models/Heritage";
import { verifyAuth } from "@/lib/auth";

// GET single heritage
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const heritage = await Heritage.findById(id);

        if (!heritage) {
            return NextResponse.json(
                { error: "Heritage not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(heritage);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch heritage" },
            { status: 500 }
        );
    }
}

// PUT update heritage
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const payload = verifyAuth(req);
        if (!payload) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await connectDB();
        const body = await req.json();

        const heritage = await Heritage.findByIdAndUpdate(
            id,
            { ...body },
            { new: true, runValidators: true }
        );

        if (!heritage) {
            return NextResponse.json(
                { error: "Heritage not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(heritage);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update heritage" },
            { status: 500 }
        );
    }
}

// DELETE heritage
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const payload = verifyAuth(req);
        if (!payload) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await connectDB();
        const heritage = await Heritage.findByIdAndDelete(id);

        if (!heritage) {
            return NextResponse.json(
                { error: "Heritage not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Heritage deleted successfully" });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to delete heritage" },
            { status: 500 }
        );
    }
}
