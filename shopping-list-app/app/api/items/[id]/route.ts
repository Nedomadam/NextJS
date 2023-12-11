import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export async function GET(req: NextApiRequest, res: NextApiResponse, { params }: { params: { id: number } }) {
  const { id } = params
  const item = await prisma.items.findUnique({
    where: { id },
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
  return new Response(JSON.stringify(item), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
