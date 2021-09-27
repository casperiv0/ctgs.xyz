import { prisma } from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).send("Method not allowed");
  }

  const slug = req.query.slug as string;

  let data = await prisma.url.findUnique({
    where: {
      slug,
    },
  });

  if (!data) {
    return res.status(400).send("Not Found");
  }

  data = await prisma.url.update({
    where: {
      id: data.id,
    },
    data: {
      clicks: { increment: 1 },
    },
  });

  return res.json(data);
}
