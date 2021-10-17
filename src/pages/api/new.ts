import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";
import { getSession } from "lib/auth/server";
import { validateUrlBody } from "lib/validateUrlBody";
import { parseBody } from "lib/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const body = parseBody(req);

  const session = await getSession(req);

  if (!session) {
    return res.status(401).send("Must be authorized. Please login to continue.");
  }

  const { status, error, slugified } = await validateUrlBody(body);

  if (error) {
    return res.status(status).send(error);
  }

  const data = await prisma.url.create({
    data: {
      slug: slugified!,
      url: body.url,
      userId: session?.id,
    },
  });

  return res.status(201).json(data);
}
