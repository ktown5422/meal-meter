import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { uploadToS3 } from "@/lib/s3";

export async function GET() {
    const meals = await prisma.meal.findMany({
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(meals);
}

export async function POST(req: NextRequest) {
    const form = await req.formData();
    const name = form.get("name")?.toString()!;
    const rating = parseInt(form.get("rating")?.toString()!, 10);

    // handle optional photo upload
    let photoUrl: string | null = null;
    const file = form.get("photo") as Blob | null;
    if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const key = `meals/${Date.now()}-${file.type.split("/")[1]}`;
        photoUrl = await uploadToS3(key, buffer, file.type);
    }

    const meal = await prisma.meal.create({
        data: { name, rating, photoUrl: photoUrl ?? undefined },
    });

    return NextResponse.json(meal, { status: 201 });
}
