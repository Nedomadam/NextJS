import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export async function GET_ALL(req: NextApiRequest, res: NextApiResponse) {
    const items = await prisma.items.findMany({
      select: {
        id: true,
        name: true,
        count: true,
        unit: true,
        unitId: true,
        createdAt: true,
        done: true
      },
    });
    return new Response(JSON.stringify(items), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }