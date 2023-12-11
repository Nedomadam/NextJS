import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export async function GET(req: NextApiRequest, res: NextApiResponse, { params }: { params: { id: number } }) {
    const { id } = params
    const unit = await prisma.units.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            abriviation: true
        }
    });
    return new Response(JSON.stringify(unit), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}