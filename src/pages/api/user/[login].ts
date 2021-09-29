import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";
import { getSession } from "lib/auth/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req);
  const login = req.query.login as string;

  const user = await prisma.user.findUnique({
    where: {
      login,
    },
  });

  if (!user) {
    return res.status(404).send("User Not Found");
  }

  if (!session && !user.isPublic) {
    return res.status(403).send("Profile Not Public");
  }

  const urls = await prisma.url.findMany({
    where: {
      userId: user.id,
    },
  });

  return res.json({ user, urls });
}
