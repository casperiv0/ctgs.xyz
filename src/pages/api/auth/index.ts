import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";
import { getSession } from "lib/auth/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req);

  if (!session) {
    return res.status(401).send("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      login: session.login,
    },
  });

  if (!user) {
    return res.status(401).send("Unauthorized");
  }

  const urls = await prisma.url.findMany({
    where: {
      userId: user.id,
    },
  });

  return res.json({ user, urls });
}
