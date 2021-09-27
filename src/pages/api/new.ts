import { prisma } from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  // todo: use `@casper124578/utils` and `yup`
  if (!body.slug || !body.url) {
    return res.status(400).json({
      error: "TODO",
    });
  }

  const data = await prisma.url.create({
    data: {
      slug: body.slug,
      url: body.url,
    },
  });

  return res.status(201).json(data);
}
