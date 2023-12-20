import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const items = await prisma.item.findMany({
      select: {
        id: true,
        name: true,
        count: true,
        unit: true,
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

export async function DELETE(req: Request, res: Response) {
    try {
      const body = await req.json()
      const item = await prisma.item.deleteMany({
        where: {id: { in: body.ids }}
      })
      console.log(body.ids)
      return new Response(
        JSON.stringify({
          message: "Items deleted: " + body.ids.join(', '),
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    catch{
      return new Response(
        JSON.stringify({
          message: "Internal Server Error",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
}