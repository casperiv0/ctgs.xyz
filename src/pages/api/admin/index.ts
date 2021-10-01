import type { NextApiRequest, NextApiResponse } from "next";
import { getSession, isAdmin } from "lib/auth/server";
import { prisma } from "lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req);
  const method = req.method as keyof typeof handlers;

  if (!isAdmin(session)) {
    return res.status(403).send("Forbidden");
  }

  const handlers = {
    GET: async () => {
      const urls = await prisma.url.findMany({
        include: {
          user: true,
        },
      });

      const users = await prisma.user.findMany();

      // todo: infinite scroll
      return res.json({ urls, users });
    },
  };

  const handler = handlers[method];
  if (handler) {
    return handler();
  }

  return res.status(405).send("Method not allowed");
}
