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

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json()

    if ( !body.name || !body.count) {
      return new Response(
        JSON.stringify({
          message: "Name and count is required",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const item = await prisma.item.create({
      data: {
          name: body.name,
          count: body.count,
          unit: body.unit,
          done: false
      },
    });
    return new Response(JSON.stringify(item), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  catch(e) {
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

export async function DELETE(req: Request, res: Response) {
  try {
    const body = await req.json()
    const item = await prisma.item.delete({
      where: { id: body.id}
    });
    return new Response(
      JSON.stringify({
        message: "Item deleted: " + body.id,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  catch {
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
